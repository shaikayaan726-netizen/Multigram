import {useState} from "react";
import {FiCheck} from "react-icons/fi";

function ReelText({value,onChange,onClose}){

    const [f,setF] = useState("Arial");
    const [c,setC] = useState("#fff");

    const fonts = [
        "Arial",
        "Georgia",
        "Courier New",
        "Impact",
        "Verdana"
    ];

    const colors = [
        "#fff",
        "#000",
        "#ff3040",
        "#ff9500",
        "#ffd60a",
        "#30d158",
        "#0a84ff",
        "#bf5af2"
    ];

    function updateValue(nextValue){
        onChange({
            value: nextValue,
            font: f,
            color: c
        });
    }

    function updateFont(nextFont){
        setF(nextFont);

        onChange({
            value: value || "",
            font: nextFont,
            color: c
        });
    }

    function updateColor(nextColor){
        setC(nextColor);

        onChange({
            value: value || "",
            font: f,
            color: nextColor
        });
    }

    return (
        <div className="reel-panel">

            <header>
                <h2>Text</h2>

                <button onClick={onClose}>
                    <FiCheck/>
                </button>
            </header>

            <input
                className="text-input"
                autoFocus
                value={value}
                onChange={e => updateValue(e.target.value)}
                placeholder="Type something..."
            />

            <h3>Fonts</h3>

            <div className="font-list">
                {fonts.map(x => (
                    <button
                        key={x}
                        style={{fontFamily:x}}
                        className={f === x ? "active" : ""}
                        onClick={() => updateFont(x)}
                    >
                        Aa
                    </button>
                ))}
            </div>

            <h3>Colours</h3>

            <div className="color-list">
                {colors.map(x => (
                    <button
                        key={x}
                        style={{background:x}}
                        className={c === x ? "active" : ""}
                        onClick={() => updateColor(x)}
                    />
                ))}
            </div>

        </div>
    );
}

export default ReelText;