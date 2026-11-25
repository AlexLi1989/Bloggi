import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const isNotFound = !error || error?.status === 404;
  if (isNotFound)
    return (
      <section className="py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold text-stone-900">
          404 - Page Not Found
        </h1>
        <p className="text-sm text-stone-500">
          The page you are looking for does not exist.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-block px-5 py-2.5 rounded-lg bg-indigo-200 text-white text-sm font-bold hover:bg-indigo-300 transition
          "
          >
            Back to Home
          </Link>
        </div>
      </section>
    );

  return (
    <section className="py-16 text-center space-y-4">
      <h2 className="text-2xl font-bold text-stone-900">
        Network connection failed
      </h2>
      <p className="text-sm text-stone-500">
        Something went wrong while loading this page.
      </p>
      <div className="pt-2">
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-lg bg-indigo-200 text-white text-sm font-medium hover:bg-indigo-300 transition cursor-pointer"
        >
          Retry
        </button>
      </div>
    </section>
  );
}
