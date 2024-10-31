import { Form} from "react-router-dom";


// TODO: use partials for the Form elements?


export default function AdvancedSearch() {
  return (
    <main>
      <div className="grid-container" style={{ gridTemplateColumns: "100%" }}>
        <div className="grid-item">
          <Form action="/advanced-search/" className="advanced-search" method="post">
            <div className="advanced-search-item">
              <label htmlFor="cardname" className="span-bold">Card Name</label>
              <input id="cardname" name="name" type="text" placeholder='Any words in the name, e.g., "Elf"'/>
            </div>
      
            <div className="advanced-search-item">
              <label htmlFor="cardtype" className="span-bold">Card Type</label>
              <select id="cardtype" name="cardtype">
                <option value="">Any</option>
                <option value="Fighter">Fighter</option>
                <option value="Challenge">Challenge</option>
                <option value="Item">Item</option>
                <option value="Landscape">Landscape</option>
              </select>
            </div>
      
            <div className="advanced-search-item | color-select">
      
              <label htmlFor="inlineCheckbox1" className="span-bold">Colors</label>

              <div>
                <input type="checkbox" className="checkbox" name="color" id="inlineCheckbox4" value="red"/>
                <label htmlFor="inlineCheckbox4">Red</label>
              </div>

              <div>
                <input type="checkbox" className="checkbox" name="color" id="inlineCheckbox3" value="green"/>
                <label htmlFor="inlineCheckbox3">Green</label>
              </div>

              <div>
                <input type="checkbox" className="checkbox" name="color" id="inlineCheckbox2" value="blue"/>
                <label htmlFor="inlineCheckbox2">Blue</label>
              </div>

              <div>
                <input type="checkbox" className="checkbox" name="color" id="inlineCheckbox1" value="black"/>
                <label htmlFor="inlineCheckbox1">Black</label>
              </div>
      
              <div>
                <select name="color_compare" id="color-compare">
                  <option value="exact">Exactly these colors</option>
                  <option value="least-one">At least one of these colors</option>
                  <option value="include-all">Including all of these colors</option>
                  <option value="most">At most these colors</option>
                </select>
              </div>
              
            </div>
      
            <div className="advanced-search-item">
              <label htmlFor="type" className="span-bold">Type</label>
              <input id="type" name="type" type="text" placeholder='Type 1 or 2, e.g., "Beast"'/>
            </div>
      
            <div className="advanced-search-item">
              <label htmlFor="dmg_compare_method" className="span-bold">DMG</label>
              <select id="dmg_compare_method" name="dmg_compare_method">
                <option value="$eq">equal to</option>
                <option value="$lt">less than</option>
                <option value="$gt">greater than</option>
                <option value="$lte">less than or equal to</option>
                <option value="$gte">greater than or equal to</option>
                <option value="$not">not equal to</option>
              </select>
              <select id="dmg_compare" name="dmg" defaultValue="any">
                <option value="any">any</option>
                <option value=""></option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="C">C</option>
              </select>
            </div>
      
            <div className="advanced-search-item">
              <label htmlFor="def_compare_method" className="span-bold">DEF</label>
              <select id="def_compare_method" name="def_compare_method">
                <option value="$eq">equal to</option>
                <option value="$lt">less than</option>
                <option value="$gt">greater than</option>
                <option value="$lte">less than or equal to</option>
                <option value="$gte">greater than or equal to</option>
                <option value="$not">not equal to</option>
              </select>
              <select id="def_compare" name="def" defaultValue="any">
                <option value="any">any</option>
                <option value=""></option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </select>
            </div>
      
            <div className="advanced-search-item | dice-select">
              <label htmlFor="DiceYes" className="span-bold">Dice?</label>
              <div id="DiceYes">
                <input type="radio" name="dice" id="inlineRadio1" value="Yes"/>
                <label htmlFor="inlineRadio1">Yes</label>
              </div>
              <div>
                <input type="radio" name="dice" id="inlineRadio2" value="No"/>
                <label htmlFor="inlineRadio2">No</label>
              </div>
              <div>
                <input type="radio" name="dice" id="inlineRadio3" value="Irrelevant"/>
                <label htmlFor="inlineRadio3">Irrelevant</label>
              </div>
            </div>

            <div className="advanced-search-item | token-select">
              <label htmlFor="inlineCheckbox1" className="span-bold">Token?</label>
              <div>
                <input type="checkbox" className="checkbox" name="token" id="inlineCheckbox5" value="{bn}"/>
                <label htmlFor="inlineCheckbox5">
                  <img className="advanced-search-token" src="/images/bones.png" alt="Bones"/>
                </label>
              </div>

              <div>
                <input type="checkbox" className="checkbox" name="token" id="inlineCheckbox6" value="{c}"/>
                <label htmlFor="inlineCheckbox6">
                  <img className="advanced-search-token" src="/images/coil.png" alt="Coil"/>
                </label>
              </div>

              <div>
                <input type="checkbox" className="checkbox" name="token" id="inlineCheckbox7" value="{t}"/>
                <label htmlFor="inlineCheckbox7">
                  <img className="advanced-search-token" src="/images/treefolk.png" alt="Treefolk"/>
                </label>
              </div>

              <div>
                <input type="checkbox" className="checkbox" name="token" id="inlineCheckbox8" value="{bb}"/>
                <label htmlFor="inlineCheckbox8">
                  <img className="advanced-search-token" src="/images/bomb.png" alt="Bomb"/>
                </label>
              </div>

              <div>
                <select name="token_compare" id="token_compare">
                  <option value="exact">Exactly these tokens</option>
                  <option value="least-one">At least one of these tokens</option>
                  <option value="include-all">Including all of these tokens</option>
                </select>
              </div>
            </div>
      
            <div className="advanced-search-item">
              <label htmlFor="effectOrStep" className="span-bold">Effects or Steps</label>
              <input id="effectOrStep" name="effectOrStep" type="text" placeholder='Any words in the text, e.g., "Destroy".'/>
              
              <input type="checkbox" id="effectOrStep-matchall" name="effectOrStep_matchall" value="true"/>
              <label htmlFor="effectOrStep-matchall">Match all words</label>

              <input type="checkbox" id="effectOrStep-exact" name="effectOrStep_exact" value="true"/>
              <label htmlFor="effectOrStep-exact">Exact search</label>
            </div>
      
            <div className="advanced-search-item">
              <label htmlFor="set" className="span-bold">Set(s)</label>
              <select id="set" name="set" multiple>
                <option value="">All</option>
                {/* TODO populate sets dynamically */}
                <option value="Core Set">Core Set</option>
                <option value="Evil Science">Evil Science</option>
                <option value="Twisted Tides">Twisted Tides</option>
              </select>
            </div>
      
            <input type="submit" value="Search with these values."/>
      
          </Form>
        </div>
      </div>
    </main>
  );
}