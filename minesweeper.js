var board = [];
var rows = 8, columns = 8;

var minesCount = 10;
var minesLocation = []; // format for it being "rowNumber-columnNumber". ex: "4-0", "2-3";

var tilesClicked = 0; // all tiles except the ones containing mines are to be clicked;

var flagEnabled = false;

var gameOver = false;

window.onload = function()
{
    startGame();
}

function setMines()
{
    let minesLeft = minesCount;
    while (minesLeft > 0)
    { 
        let r = Math.floor (Math.random() * rows);
        let c = Math.floor (Math.random() * columns);

        let currentId = getId (r, c); 

        if (minesLocation.includes (currentId) == false)
        {
            minesLocation.push (currentId);
            --minesLeft;
        }
    }
}


function startGame()
{
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);

    setMines();

    // making-up the tiles that form our board:
    for (let r = 0; r < rows; ++r)
    {
        let row = [];
        for (let c = 0; c < columns; ++c)
        {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = getId (r, c);
            tile.addEventListener("click", clickTile);

            document.getElementById("board").append(tile);

            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag()
{
    if (flagEnabled)
    {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else
    {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile()
{
    if (gameOver || this.classList.contains("tile-clicked"))
    {
        return;
    }

    let tile = this;
    if (flagEnabled)
    {
        if ("" == tile.innerText)
        {
            tile.innerText = "🚩";
        }
        else if ("🚩" == tile.innerText)
        {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id))
    {
        gameOver = true;
        revealMines();
        return;
    }


    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    checkMine(r, c);
}

function revealMines()
{
    for (let r = 0; r < rows; ++r)
    {
        for (let c = 0; c < columns; ++c)
        {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id))
            {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkMine (r, c)
{
    if (r < 0 || r >= rows || c < 0 || c >= columns)
    {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked"))
    {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    ++tilesClicked;

    let minesFound = 0;

    for (let deltar = -1; deltar <= 1; ++deltar)
    {
        for (let deltac = -1; deltac <= 1; ++deltac)
        {
            // skipping the iteration when we are at (r, c) again:
            if (0 == deltar && 0 == deltac) continue;

            minesFound += checkTile (r + deltar, c + deltac);
        }
    }

    if (minesFound > 0)
    {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add ("x" + minesFound.toString());
    }
    else
    {
        
        for (let deltar = -1; deltar <= 1; ++deltar)
        {
            for (let deltac = -1; deltac <= 1; ++deltac)
            {
                // skipping the iteration when we are at (r, c) again:
                if (0 == deltar && 0 == deltac) continue;
    
                checkMine (r + deltar, c + deltac);
            }
        }
    }

    if (rows*columns - minesCount == tilesClicked)
    {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }

}


function checkTile (r, c)
{
    if (r < 0 || r >= rows || c < 0 || c >= columns)
    {
        return 0;
    }
    if (minesLocation.includes(getId (r, c)))
    {
        return 1;
    }
    return 0;
}

function getId (r, c)
{
    return r.toString() + "-" + c.toString();
}