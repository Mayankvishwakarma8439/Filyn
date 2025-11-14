import React from "react";
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen ">
      <section className="hidden lg:block min-w-[40%] p-10 bg-brand text-white">
        <div className="flex items-center gap-4">
          <img src="./favicon.ico" className="w-[100px]" alt="" />
          <p className="text-4xl font-semibold">Filyn</p>
        </div>

        <h1 className="mt-[70px] text-4xl font-extrabold">
          Manage your files the best way
        </h1>
        <p className="mt-5 text-lg">
          This is the place where you can manage all your documents.
        </p>
        <div className="flex justify-center items-center">
          {" "}
          <img
            src="assets/images/files.png"
            className="mt-10 w-[300px] transition-all hover:rotate-2 hover:scale-110"
            alt=""
          />
        </div>
      </section>
      <div className="flex justify-center items-center w-full">{children}</div>
    </div>
  );
};

export default layout;
