import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useMe } from "../hooks/useMe";
import uberLogo from "../images/uberlogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { LOCALSTORAGE_TOKEN } from "../constant";
import { authTokenVar, isLoggedInVar } from "../apollo";

export const Header: React.FC = () => {
  const { data } = useMe();
  const navigate = useNavigate();
  const logOut = () => {
    console.log("logout");
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    authTokenVar("");
    isLoggedInVar(false);
    navigate(0);
  };

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white">
          <span>Please verify your email</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={uberLogo} alt="Nuber Eats" className="w-26" />
          </Link>
          <span className="text-xs">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </Link>
            {data?.me.email}
          </span>
          <Link to="/" onClick={logOut}>
            Log Out
          </Link>
        </div>
      </header>
    </>
  );
};
