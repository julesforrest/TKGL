import Head from "next/head";

const Home = () => {
  return (
    <div className="container">
      <form
        action="/api/sync"
        method="GET"
        onSubmit={async (e) => {
          e.preventDefault();
          const syncResponse = await fetch("/api/sync");
          const syncResponseJson = await syncResponse.json();
          console.log(syncResponseJson);
        }}
      >
        <button type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Build shopping list
        </button>
      </form>
      <style jsx>{`
        form {
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--bg-color);
        }
        button {
          position: relative;
          color: var(--color);
          font-size: 20px;
          border: 0;
          font-weight: bold;
          padding: 24px 32px;
          border-radius: 99999px;
          background: var(--bg-color);
          transition: all 100ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0px -6px 10px rgba(255, 255, 255, 1),
            0px 4px 15px rgba(0, 0, 0, 0.15);
          cursor: pointer;
        }
        .icon {
          margin-right: 16px;
          display: inline-block;
        }
      `}</style>
      <style jsx global>{`
        :root {
          --bg-color: #f2f2f2;
          --color: rgb(120, 120, 120);
        }
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;
