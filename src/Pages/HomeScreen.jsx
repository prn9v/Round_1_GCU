import { useNavigate } from "react-router-dom";
import SpinningGold from "../assets/SpinningGold.svg";
import OuterRing from "../assets/OuterRing.svg";
import Millionaire from "../assets/millionaire.svg";
import SparkleBackground from "../components/SparkleBackground";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-800 to-black flex flex-col items-center justify-center relative overflow-hidden">
      <SparkleBackground />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <img src={OuterRing} alt="Outer Ring" className="w-[500px]" />
          <img
            src={SpinningGold}
            alt="Spinning Gold"
            className="w-[250px] absolute animate-spin-slow"
          />
          <img src={Millionaire} alt="Millionaire" className="absolute" />
        </div>

        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg font-bold px-8 py-4 mt-8 shadow-md relative"
          style={{
            clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
            width: "200px",
          }}
          onClick={() => navigate('/quiz')}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;