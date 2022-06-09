import { Auth } from "aws-amplify";
import { apiEndpoint } from "./App";

export const getToken = async () => {
  const session = await Auth.currentSession();
  return `Bearer ${session.getIdToken().getJwtToken()}`;
};

export const addBalance = async (amount: Number, note: string) => {
  const token = await getToken();
  const res = await fetch(`${apiEndpoint}/balances`, {
    method: "POST",
    headers: { Authorization: token },
    body: JSON.stringify({
      amount,
      note,
    }),
  });
};

export const getBalances = async () => {
  const token = await getToken();
  const res = await fetch(`${apiEndpoint}/balances`, {
    headers: { Authorization: token },
  });

  return res.json();
};
