import React, { useState, useEffect } from "react";
import { addBalance, getBalances } from "./api";
import { Formik } from "formik";

const Balance = (props: any) => {
  return (
    <div key={props.balance.balanceId}>
      <div>
        <strong>Amount:</strong>
        <span>{props.balance.amount}</span>
      </div>
      <div>
        <strong>Note:</strong>
        <span>{props.balance.note}</span>
      </div>
    </div>
  );
};

const AddBalanceForm = () => {
  const initialValues = {
    amount: 25,
    note: "Test Deposit",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        await addBalance(values.amount, values.note);
        // we don't have a real api layer on the frontend, so just reload page
        // to see new data
        global.location.reload();
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="dataField">
            <label>Amount</label>
            <input
              className="input"
              type="text"
              id="amount"
              value={values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className="dataField">
            <label>Note</label>
            <input
              className="input"
              type="text"
              id="note"
              value={values.note}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className="button">
            <button type="submit" className="input" disabled={isSubmitting}>
              Add To Balance
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export const BalancesPage: React.FC = () => {
  const [balances, setBalances] = useState<[] | undefined>();

  useEffect(() => {
    const _getBalances = async () => {
      const res = await getBalances();
      // await addBalance(25, 'Test Amount');
      // setTime(res.cur_date);
      setBalances(res);
    };

    _getBalances();
  }, []);

  return (
    <div>
      <AddBalanceForm />
      <h1>Your Balances</h1>
      {balances?.map((balance) => (
        <Balance balance={balance} />
      ))}
    </div>
  );
};
