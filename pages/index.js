import Head from "next/head";
import { useState } from "react";

const Home = () => {
  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <div className="container">
      <form
        action="/api/sync"
        method="GET"
        onSubmit={async (e) => {
          setButtonLoading(true);
          e.preventDefault();
          const syncResponse = await fetch("/api/sync");
          const syncResponseJson = await syncResponse.json();
          console.log(syncResponseJson);
          setButtonLoading(false);
        }}
      >
        <button type="submit">
          {buttonLoading ? (
            <>
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="icon spinner"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L12 6"></path>
                <path d="M12 18L12 22"></path>
                <path d="M4.93 4.93L7.76 7.76"></path>
                <path d="M16.24 16.24L19.07 19.07"></path>
                <path d="M2 12L6 12"></path>
                <path d="M18 12L22 12"></path>
                <path d="M4.93 19.07L7.76 16.24"></path>
                <path d="M16.24 7.76L19.07 4.93"></path>
              </svg>
              Adding items to list
            </>
          ) : (
            <>
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
            </>
          )}
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
        button:after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 99999px;
          z-index: 2;
        }
        button:focus {
          border: none;
          outline: 0 !important;
          outline-style: none;
        }
        button:active {
          box-shadow: 0 15px 20px rgba(0, 0, 0, 0.02);
        }
        button:active:after {
          box-shadow: inset 0px -2px 5px rgb(255, 255, 255),
            inset 0px 2px 5px rgba(0, 0, 0, 0.15);
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
          --offset: 187;
          --duration: 2s;
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

        @-webkit-keyframes rotation {
          from {
            -webkit-transform: rotate(0deg);
          }
          to {
            -webkit-transform: rotate(359deg);
          }
        }

        .spinner {
          -webkit-animation: rotation 3s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Home;
