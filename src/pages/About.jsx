const About = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center px-4">
      <h1 className="text-3xl font-bold p-8">Who are we?</h1>
      <div className="max-w-[40%] text-gray-800">
        <p className="m-2 p-2">
          Hello, my name is David, and I am currently a third-year Computer Science student at the University of Luxembourg.
        </p>
        <p className="m-2 p-2">
          LetzGrade is a web app that allows Luxembourgish students at any level to store, manage, and track their academic progress.
          LetzGrade focuses on functionality, simplicity, and creating a unified platform for everyone.
        </p>
      </div>
    </div>
  );
};

export default About;
