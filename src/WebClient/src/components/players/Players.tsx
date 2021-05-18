import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import LobbyState from "../../state/LobbyState";

const Players = observer(() => {
  const ban = (playerId: string) => {
    LobbyState.banPlayer(playerId, () => {});
  };

  return (
    <div>
      Players:
      <div>
        <ul>
          {LobbyState.lobby?.players.map((player, key) => {
            if (player.active) {
              return (
                <li key={key}>
                  {player.displayName}{" "}
                  <button
                    onClick={() => {
                      ban(player.id);
                    }}
                  >
                    Ban
                  </button>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
});

export default Players;
