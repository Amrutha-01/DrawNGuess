export const ColorPalette = ({ onSelectColor }) => {
  const primaryColors = [
    "hsl(0, 100%, 50%)",
    "hsl(30, 100%, 50%)",
    "hsl(60, 100%, 50%)",
    "hsl(120, 100%, 50%)",
    "hsl(180, 100%, 50%)",
    "hsl(240, 100%, 50%)",
    "hsl(270, 100%, 50%)",
    "hsl(300, 100%, 50%)",
    "hsl(0, 0%, 0%)",
  ];

  return (
    <div className="color-palette">
      {primaryColors.map((color) => (
        <div
          key={color}
          onClick={() => onSelectColor(color)}
          style={{
            backgroundColor: color,
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "2px solid #171716",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            margin: "5px",
          }}
        />
      ))}
    </div>
  );
};
