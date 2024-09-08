export default function ThicknessButtons({
  onSelectThickness,
  selectedThickness,
  setModes,
}) {
  const thicknessLevels = [5, 7, 10, 15];

  return (
    <div className="thickness-buttons flex">
      {thicknessLevels.map((thickness) => (
        <button
          key={thickness}
          onClick={() => {
            onSelectThickness(thickness);
            setModes((prevModes) => ({
              ...prevModes,
              clearMode: false,
            }));
          }}
          className={`flex items-center justify-center bg-white border border-[#7f36ba] rounded-md mx-2 my-2 ${
            selectedThickness === thickness ? "border-2 border-[#7f36ba]" : ""
          }`}
          style={{
            width: "40px",
            height: "30px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              backgroundColor:
                selectedThickness === thickness ? "#7f36ba" : "black",
              width: `${thickness}px`,
              height: `${thickness}px`,
              borderRadius: "50%",
            }}
          />
        </button>
      ))}
    </div>
  );
}
