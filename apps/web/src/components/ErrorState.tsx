type ErrorStateProps = {
  message?: string;
};

export function ErrorState({ message = 'Daten konnten nicht geladen werden.' }: ErrorStateProps) {
  return <p className="error">{message}</p>;
}
