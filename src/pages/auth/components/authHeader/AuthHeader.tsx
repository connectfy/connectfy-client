import MainIcon from "@assets/icons/MainIcon";
import "./css/mainHeader.style.css";

const AuthHeader = () => {
  return (
    <header className="auth-header">
      <div className="logo">
        <MainIcon
          styles={{
            width: "40px",
            height: "40px",
            overflow: "visible",
            opacity: 1,
            zIndex: 1,
            fill: "rgb(46, 204, 113)",
          }}
        />
        <h1>Connectfy</h1>
      </div>
    </header>
  );
};

export default AuthHeader;
