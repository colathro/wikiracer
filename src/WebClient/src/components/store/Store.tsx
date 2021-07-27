import styled from "styled-components";
import { useState, useEffect } from "react";
import AuthState from "../../state/AuthState";
import { StoreItem } from "../../types/Store";
import AvailableItem from "./AvailableItem";

const BigLayout = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const Layout = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: flex-start;
`;

const Store = () => {
  const [availableItems, setAvailableItems] = useState<StoreItem[]>();

  useEffect(() => {
    AuthState.getUser();
    AuthState.getStoreItems(setAvailableItems);
  }, []);

  const refresh = () => {
    AuthState.getUser();
    AuthState.getStoreItems(setAvailableItems);
  };

  return (
    <BigLayout>
      <Layout>
        {availableItems == undefined ? (
          <div>Loading</div>
        ) : (
          availableItems?.map((item, ind) => {
            return (
              <AvailableItem
                refresh={refresh}
                key={ind}
                item={item}
              ></AvailableItem>
            );
          })
        )}
      </Layout>
    </BigLayout>
  );
};

export default Store;
