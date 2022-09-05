import { GetServerSideProps, NextApiRequest } from "next";
import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import ToiletForm from "src/components/toiletForm";

export default function Add() {
  return <Layout main={<ToiletForm/>} />;
}


//Prevents users from adding a toilet if they are not logged in
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const uid = await loadIdToken(req as NextApiRequest);

  if (!uid) {
    res.setHeader("location", "/auth");
    res.statusCode = 302;
    res.end();
  }

  return { props: {} };
}
