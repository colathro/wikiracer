import styled from "styled-components";
import { PrimaryButton, Text } from "@fluentui/react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { IconButton } from "@fluentui/react/lib/Button";

const BigLayout = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
`;

const StoreLayout = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  margin-top: 3em;
`;

const CookieCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 600px;
  box-shadow: rgb(0 0 0 / 13%) 0px 3.2px 7.2px 0px,
    rgb(0 0 0 / 11%) 0px 0.6px 1.8px 0px;
  outline: transparent;
`;

const CookieCardInner = styled.div`
  display: flex;
  flex: 1;
  margin: 1em;
`;

const CookieClicker = () => {
  const [cookies, setCookies] = useState(0);
  const cookieRef = useRef<number>(cookies);
  const workerRef = useRef<Worker[]>([]);
  const setCookieRef =
    useRef<React.Dispatch<React.SetStateAction<number>>>(setCookies);

  setCookieRef.current = setCookies;
  cookieRef.current = cookies;

  useEffect(() => {
    const backgroundJob = window.setInterval(() => {
      var total = 0;
      for (var i = 0, _len = workerRef.current.length; i < _len; i++) {
        total += workerRef.current[i].amount;
      }
      var newTotal = total + cookieRef.current;
      setCookieRef.current(newTotal);
    }, 1000);
    return () => {
      window.clearInterval(backgroundJob);
    };
  }, []);

  const [weaponStore, setWeaponStore] = useState<Weapon[]>([
    { name: "big stick", amount: 5, cost: 50 },
    { name: "mace", amount: 10, cost: 300 },
    { name: "sword", amount: 20, cost: 800 },
    { name: "heavy sword", amount: 40, cost: 3200 },
    { name: "spell wand", amount: 100, cost: 6400 },
    { name: "fire battlestaff", amount: 200, cost: 12800 },
  ]);

  const [workerStore, setWorkerStore] = useState<Worker[]>([
    { name: "ant", amount: 10, cost: 1000 },
    { name: "mouse", amount: 50, cost: 5000 },
    { name: "dog", amount: 100, cost: 10000 },
    { name: "peasant", amount: 200, cost: 20000 },
    { name: "knight", amount: 400, cost: 40000 },
    { name: "space marine", amount: 1000, cost: 60000 },
  ]);

  const [weapon, setWeapon] = useState<Weapon>({
    name: "stick",
    amount: 1,
    cost: 0,
  });

  const [workers, setWorkers] = useState<Worker[]>([]);
  workerRef.current = workers;

  const processCookieClick = () => {
    const newTotalCookies = weapon.amount + cookies;
    setCookies(newTotalCookies);
  };

  const buyWeapon = (weaponPurchase: Weapon) => {
    setWeapon(weaponPurchase);
    const leftOverCookies = cookies - weaponPurchase.cost;
    setCookies(leftOverCookies);
  };

  const buyWorker = (workerPurchase: Worker) => {
    workers.push(workerPurchase);
    setWorkers(workers);
    const leftOverCookies = cookies - workerPurchase.cost;
    setCookies(leftOverCookies);
  };

  return (
    <BigLayout>
      <StoreLayout>
        <div>
          <Text variant="large">Active Weapon: {weapon.name}</Text>
          <div>
            <Text variant="large"> Weapon Store:</Text>
            <div>
              <Text>
                {weaponStore.map((weaponForSale, ind) => {
                  return (
                    <div key={ind}>
                      <Text variant="mediumPlus">{weaponForSale.name}</Text>{" "}
                      cookies per accept: {weaponForSale.amount} costs:{" "}
                      {weaponForSale.cost}
                      <IconButton
                        iconProps={{ iconName: "CalculatorAddition" }}
                        disabled={
                          weaponForSale.cost > cookies ||
                          weaponForSale.amount <= weapon.amount
                        }
                        onClick={() => {
                          buyWeapon(weaponForSale);
                        }}
                      ></IconButton>
                    </div>
                  );
                })}
              </Text>
            </div>
          </div>
        </div>
        <div>
          <Text variant="large">
            Active Workers:{" "}
            {workers.map((worker, ind) => {
              return <Text key={ind}>{worker.name},</Text>;
            })}
          </Text>
          <div>
            <Text variant="large"> Worker Store:</Text>
            <div>
              <Text>
                {workerStore.map((weaponForSale, ind) => {
                  return (
                    <div key={ind}>
                      <Text variant="mediumPlus">{weaponForSale.name}</Text>{" "}
                      cookies per second: {weaponForSale.amount} costs:{" "}
                      {weaponForSale.cost}
                      <IconButton
                        iconProps={{ iconName: "CalculatorAddition" }}
                        disabled={weaponForSale.cost > cookies}
                        onClick={() => {
                          buyWorker(weaponForSale);
                        }}
                      ></IconButton>
                    </div>
                  );
                })}
              </Text>
            </div>
          </div>
        </div>
      </StoreLayout>
      <StoreLayout>
        <img src="/images/icons/cookie.png" height="100px"></img>
        <Text variant="xxLargePlus">{cookies}</Text>
      </StoreLayout>
      <StoreLayout>
        <CookieCard>
          <CookieCardInner>
            <p style={{ maxWidth: "350px" }}>
              <Text variant="small">
                WikiRacer uses cookies stored on your computer to provide
                information to our servers on where to route you. Please accept
                our cookies to continue!
              </Text>
            </p>
            <p>
              <PrimaryButton
                onClick={() => {
                  processCookieClick();
                }}
              >
                Accept Cookies
              </PrimaryButton>
            </p>
          </CookieCardInner>
        </CookieCard>
      </StoreLayout>
    </BigLayout>
  );
};

type Weapon = {
  name: string;
  amount: number;
  cost: number;
};

type Worker = {
  name: string;
  amount: number;
  cost: number;
};

export default CookieClicker;
