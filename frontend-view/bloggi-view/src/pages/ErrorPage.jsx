import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const isNotFound = !error || error?.status === 404;
  if (isNotFound)
    return (
      <section>
        <h1> 404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/">Back to Home</Link>
      </section>
    );

  return (
    <div>
      <h2>Network connection failed</h2>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
