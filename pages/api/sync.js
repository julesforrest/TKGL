const Airtable = require("airtable");

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const airtableBaseId = process.env.AIRTABLE_BASE_ID;
const todoistToken = process.env.TODOIST_TOKEN;
const todoistProjectId = parseInt(process.env.TODOIST_PROJECT_ID, 10);

const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);

export default async (req, res) => {
  // Get data from Airtable
  const airtableIngredients = (
    await base("Ingredients")
      .select({
        view: "Weekly shopping list",
        fields: ["Area", "Shopping list entry"],
      })
      .all()
  )
    .map((record) => record.fields)
    .sort((a, b) => (a.Area > b.Area ? 1 : -1));

  // Get all the sections
  const sectionsResponse = await fetch(
    "https://api.todoist.com/rest/v1/sections",
    {
      headers: {
        Authorization: `Bearer ${todoistToken}`,
      },
    }
  );

  // Filter so that we're only looking at sections in the relevant project.
  const sectionsToDelete = (await sectionsResponse.json()).filter(
    (section) => section.project_id === todoistProjectId
  );

  // Create array of promises to delete setions
  const deleteSectionsPromises = sectionsToDelete.map((section) => {
    return fetch(`https://api.todoist.com/rest/v1/sections/${section.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${todoistToken}`,
      },
    });
  });

  // Delete 'em
  await Promise.all(deleteSectionsPromises);

  // These are the section that we'll create in Todoist
  let shoppingAreas = [];

  airtableIngredients.map((ingredient) => {
    if (!shoppingAreas.find((area) => area.name === ingredient.Area)) {
      shoppingAreas.push({ name: ingredient["Area"] });
    }
  });

  const createSectionPromises = shoppingAreas.map((area) =>
    fetch(`https://api.todoist.com/rest/v1/sections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${todoistToken}`,
      },
      body: JSON.stringify({
        project_id: todoistProjectId,
        name: area.name,
      }),
    })
  );

  const createdSectionsResponses = await Promise.all(createSectionPromises);

  const createdSections = await Promise.all(
    createdSectionsResponses.map((res) => res.json())
  );

  // Create the tasks
  const taskCreationPromises = airtableIngredients.map((ingredient) => {
    return fetch(`https://api.todoist.com/rest/v1/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${todoistToken}`,
      },
      body: JSON.stringify({
        project_id: todoistProjectId,
        content: ingredient["Shopping list entry"],
        section_id: createdSections.find(
          (section) => section.name === ingredient.Area
        ).id,
      }),
    });
  });

  await Promise.all(taskCreationPromises);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ message: "done syncing" }));
};
