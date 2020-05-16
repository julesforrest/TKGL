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

  // Create the setions
  for (let i = 0; i < shoppingAreas.length; i++) {
    const sectionResponse = await fetch(
      `https://api.todoist.com/rest/v1/sections`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${todoistToken}`,
        },
        body: JSON.stringify({
          project_id: todoistProjectId,
          name: shoppingAreas[i].name,
        }),
      }
    );

    const createdSection = await sectionResponse.json();
    shoppingAreas[i].id = createdSection.id;
  }

  // Create the tasks
  for (let i = 0; i < airtableIngredients.length; i++) {
    await fetch(`https://api.todoist.com/rest/v1/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${todoistToken}`,
      },
      body: JSON.stringify({
        project_id: todoistProjectId,
        content: airtableIngredients[i]["Shopping list entry"],
        section_id: shoppingAreas.find(
          (area) => area.name === airtableIngredients[i].Area
        ).id,
      }),
    });
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ message: "done syncing" }));
};
