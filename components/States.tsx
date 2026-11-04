export const Loading = () => <p className="p-6 text-slate-500" role="status">Loading…</p>;
export const ErrorBox = ({ message, retry }: { message: string; retry?: () => void }) => (
  <div className="card border-critical text-sm" role="alert">
    <p className="font-semibold text-critical">Could not load data</p>
    <p className="mt-1 text-slate-600">{message}. Check that the backend is running and NEXT_PUBLIC_API_URL is correct.</p>
    {retry && <button className="btn btn-ghost mt-3" onClick={retry}>Try again</button>}
  </div>
);
