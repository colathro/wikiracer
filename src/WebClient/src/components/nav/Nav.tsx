import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import AuthState from "../../state/AuthState";

const Nav = observer(() => {
  return (
    <div>
      <h1>{AuthState.auth_info?.display_name}</h1>
      <button
        onClick={() => {
          AuthState.logout();
        }}
      >
        Logout
      </button>
    </div>
  );
});

export default Nav;
