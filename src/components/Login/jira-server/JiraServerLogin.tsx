import { LoginForm } from "./LoginForm";

export function JiraServerLogin({
  goBack,
  onSuccess,
}: {
  goBack: () => void;
  onSuccess: () => void;
}) {
  return <LoginForm onSuccess={onSuccess} goBack={goBack} />;
}
