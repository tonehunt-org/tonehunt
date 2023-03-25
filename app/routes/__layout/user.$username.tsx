export default function UserProfilePage() {
  return (
    <div className="w-full">
      <div className="flex flex-col z-30">
        <div className="flex-1">
          <div className="flex justify-center">
            <div className="w-52 h-52 rounded-full bg-tonehunt-green"></div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-center">
            <h1 className="text-4xl font-satoshi-bold mb-5">prodz1</h1>
          </div>
          <div className="flex justify-center">
            <span className="text-lg font-satoshi-regular mb-5">I am always looking for good tones.</span>
          </div>
          <div className="flex justify-center flex-row">
            <div>
              <span className="text-lg font-satoshi-regular mb-5">241 Followers</span>
            </div>
            <div>
              <span className="text-lg font-satoshi-regular mb-5">241 Following</span>
            </div>
          </div>
          <div className="flex justify-center">
            <h1 className="text-3xl font-satoshi-bold mb-5">+ FOLLOW BUTTON</h1>
          </div>
          <div className="flex justify-center">
            <h1 className="text-3xl font-satoshi-bold mb-5">TABLE HERE</h1>
          </div>
        </div>
      </div>
      <div className="block absolute top-0 left-0 w-full h-96 bg-tonehunt-purple -z-10"></div>
    </div>
  );
}
