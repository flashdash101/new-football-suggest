import { useState } from "react"

function Test() {
    const [Fruits, setFruits] = useState(["Apples", "Oranges", "Mangos"]);

    const addFruit = () => {
        if (document.getElementById("textinput").value == "") {
            alert("Please enter a fruit");
            return
        }
        else {
            const newFruit = document.getElementById("textinput").value;
            document.getElementById("textinput").value = "";
            setFruits(f => [...f, newFruit]);
            console.log(`Added the new fruit ${newFruit}`);
        }
    }

    const removeFruit = (index) => {
        setFruits(f => f.filter((_, i) => i !== index));
    }


    return (
        <div className = "Application">
            <h3>Test</h3>
            <ul> 
                {Fruits.map((f, index) => <li key={index} onClick= {() => removeFruit(index)}>{f}</li>)}
            </ul>
            <input type="text" id="textinput"
                placeholder="Enter text to add fruit" />
            <br></br>
            <input type = "submit" value = "Add fruit" onClick = {addFruit}/>
        </div>
    );
}




export default Test;