// number of columns (select)
let setMode=0
// current state of the game
const state={
	first:-1,
	second: -1,
	matched: 0,
	timer: false,
	moves: 0,
	timerId:"",
	timeoutId:""
}
//emoji array
const emojis=["🍇","🍈","🍉","🍋","🍌","🍎","🍓","🥥","🥑","🍄","🌰","🧀","🥐","🍕","🍖","🥩","🍗","🥓","🍔","🍟","🌭","🌮","🍝","🍩","🍪","🎂","🥪","🌯","🥨","🍞","🥜","🍆","🍅","🥝"];
//const emojis=["&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3","&#x1F4A3"];
//array of emojis to place on the board
let randomEmoji=[];
// array of positions on the board
let randomIndexe=[];
//fire game start
const h1TextEffect=(matchStarted)=>{
	const h1=document.getElementsByTagName("h1")[0];
	if(!matchStarted){
		h1.style.fontSize="2em";
		h1.style.paddingTop="0px";
	}
	else{
		h1.style.fontSize="";
		h1.style.paddingTop="";
	}
}
const getCards=(mode)=>{
	setMode=mode;
	clearInterval(state.timerId);
	clearTimeout(state.timeoutId);
	state.timer=false;
	state.first=-1;
	state.second=-1;
	state.moves=0;
	document.getElementById("moves").value=state.moves;
	document.getElementById("moves").style.display="";
	document.getElementById("timer").style.display="";
	if(setMode>0){
		h1TextEffect(false)
		setGame();
	}
	else {
		h1TextEffect(true)
		board.innerHTML="";
		board.style.display="";
	}
}
const resetGame=()=>{
	getCards(setMode);
}
// fill array of random emojis to place on the board
const randomFigure=()=>{
	randomEmoji=[];
	for(let i=0; i<(setMode*setMode)/2; i++){
		while(true){
			const randomIndex=Math.floor(Math.random() * (emojis.length-1));
			if(!randomEmoji.includes(randomIndex)) {randomEmoji.push(randomIndex); break};
		}
	}
}
// list of cards on the board (indexes)
const randomPlacement=()=>{
	randomIndexes=[];
	for(let i=0; i<setMode*setMode; i++){
		randomIndexes.push(-1);
	}
	for(emoji in randomEmoji){
		const emojiIndex=randomEmoji[emoji];
		for(let i=0; i<2; i++){
			stop++;
			while(true){
				const index=Math.floor(Math.random()*(randomIndexes.length));
				if(randomIndexes[index]===-1){randomIndexes[index]=emojis[emojiIndex]; break}
			}
		}
	}
}
//initial game step - show all cards
const showAll=()=>{
	const allCards=document.getElementsByClassName("main-card");
	for(card of [...allCards]){
		card.style.transform="rotateY(180deg)";
	}
	setTimeout(()=>{
		for(card of allCards){
		card.style.transform="";
		}
	},2000);
}
//match flash effect
const matchedCards=(first, second)=>{
	// console.log(first,second)
	// const firstCard=;
	// console.log(firstCard)
	document.getElementById(first).firstChild.style.backgroundColor="rgba(230,104,25,0.2";
	document.getElementById(second).firstChild.style.backgroundColor="rgba(230,104,25,0.2";
	setTimeout(()=>{
		document.getElementById(first).firstChild.style.backgroundColor="";
		document.getElementById(second).firstChild.style.backgroundColor="";
	},300);

}
// game actions
const matchCheck=(id)=>{
	if(!state.timer) {
		state.timer=0;
		state.moves=0;
		document.getElementById("moves").style.display="block";
		document.getElementById("moves").value=state.moves;
		document.getElementById("timer").style.display="block";
		document.getElementById("timer").value=state.timer;
		state.timerId=setInterval(()=>{
			document.getElementById("timer").value=state.timer;
			state.timer++;
		},1000)
	}
	//if click on flipped card do nothing
	if(id==="") return;
	// if this is the first card you flip set state of first card else set state of second card
	if(state.first===-1){ 
		state.first=id; 
		//if not click on the second card within 3 second reset the move
		state.timeoutId=setTimeout(()=>{
			if(state.second===-1){
				document.getElementById(state.first).style.transform="";
				state.first=-1;
				state.moves++;
				document.getElementById("moves").value=state.moves;
			}
		},5000);
		return;
	}
	else{
		state.second=id;
		state.moves++;
		document.getElementById("moves").value=state.moves;
	}
	// catch error - click on the same card.
	if(state.first===state.second){
		document.getElementById(state.first).style.transform="";
		state.second=-1;
		return;
	}
	// match check - if true reset state but keep cards open else reset state e flip cards back (after 1 second to show second card figure)
	if(randomIndexes[state.first]===randomIndexes[id]) {
		clearTimeout(state.timeoutId);
		matchedCards(state.first, state.second)
		state.matched--;
		state.first=-1;
		state.second=-1;
	}
	else{
		setTimeout(()=>{
			clearTimeout(state.timeoutId);
			document.getElementById(state.first).style.transform="";
			document.getElementById(id).style.transform="";
			state.first=-1;
			state.second=-1;
		},1000);
	return;
	}
	// if there are no cards left game is completed.
	if (state.matched===0) {
		clearInterval(state.timerId);
		setTimeout(()=>{
			document.getElementById("alert").style.display="flex";
			document.getElementById("message").innerHTML="COMPLETED IN "+state.timer+" SECONDS WITH "+state.moves+" MOVES!";
			state.timer=false;
			document.getElementsByTagName("select")[0].selectedIndex=0;
			document.getElementById("moves").style.display="";
			document.getElementById("timer").style.display="";
			getCards();
		},600)
		state.first=-1;
		state.second=-1;
	return;
	}
}
const hideAlert=()=>{
	document.getElementById("alert").style.display="";
}
const newCard=(placeOnBoard)=>{
	const singleCard=document.createElement("div");
	singleCard.onclick=(event)=>{
		const mainCard=(event.target.classList.contains("main-card"))?event.target:event.target.parentNode;
		if(state.second===-1){
			mainCard.style.transform="rotateY(180deg)";
			matchCheck(mainCard.id);
		}
	}
	singleCard.setAttribute("id",placeOnBoard);
	const cardBack=document.createElement("div");
	const frontCard=document.createElement("div");
	const cardFigure=document.createElement("p");
	const figure=document.createTextNode(randomIndexes[placeOnBoard]);
	cardFigure.appendChild(figure);
	frontCard.appendChild(cardFigure);
	singleCard.classList.add("main-card");
	frontCard.classList.add("card-front");
	cardBack.classList.add("card-back");
	singleCard.appendChild(frontCard);
	singleCard.appendChild(cardBack);
	return singleCard;
}

const setGame=()=>{
	state.matched=(setMode*setMode)/2;
	randomFigure();
	randomPlacement();
	const board=document.getElementById("board");
	board.innerHTML="";
	board.style.width=setMode*120+"px";
	board.style.height="auto";
	board.style.display="grid";
	let placement=0;
	for(let i=0; i<setMode; i++){
		const element=document.createElement("div");
		element.setAttribute("id","row"+i);
			for(let j=0; j<setMode; j++){
			element.appendChild(newCard(placement));
			placement++;
			}
		board.appendChild(element);
	}
	showAll();
}