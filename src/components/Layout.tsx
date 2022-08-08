import React from "react";
import { LayoutType } from "../types/typings";
import Head from "next/head";
import Header from "./Header";

export default function Layout({
  title,
  description,
  keywords,
  children,
}: LayoutType) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>
      <Header />
      <main>{children}</main>
    </>
  );
}

Layout.defaultProps = {
  title: "Tikma | Book your tickets",
  description: "Get your new look",
  keywords: "Cinema, tickets",
};
