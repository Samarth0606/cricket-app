import Button, { type ButtonProps } from "../button";

export default function LoginButton(props: ButtonProps) {
  const handleClick = () => {
    document
      .getElementsByTagName("cb-login-signup")[0]
      .classList.remove("hide-cb-login-signup-prompt");
  };

  return (
    <>
      <Button {...props} type="button" onClick={handleClick} />
      <cb-login-signup class="hide-cb-login-signup-prompt"></cb-login-signup>
    </>
  );
}
