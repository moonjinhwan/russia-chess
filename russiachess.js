//클릭시 현 플레이어와 칸 번호 받아들임
function ClickHandlers(){
	for (var player = 0; player < 2; player++) {
		for (var stack = 0; stack < 6; stack++) {
			$(`#player-${player}-stack-${stack}`).on('click', (function(thisPlayer, stackNumber) {
				return function() {selectUnplayedPiece(thisPlayer, stackNumber);};
			})(player, stack));
		}
	}
	for (var square = 0; square < 9; square++) {
		$(`#square-${square}`).on('click', (function(selectedSquare) {
			return function() {selectSquare(selectedSquare);};
		})(square));
	}
}
var boardState = [];

function initBoardState() {
	for (var i=0; i<9; i++) {
		boardState.push({ // 상자 한칸 한칸 마다 squareStack이란 배열을 push해줌
			squareStack : []
		});
	}
}
var isPieceSelected = false;
var selectedPiece;
var currentPlayer = 0;

var playerState = {
	0 : {
		stacks : [3, 3, 2, 2, 1, 1],
	},

	1 : {
		stacks : [3, 3, 2, 2, 1, 1],
	},
};

function selectUnplayedPiece(player, stackNumber){
	//바깥 piece 선택
	if (player !== currentPlayer) {
		alert('상대 턴 입니다.');
		return;
	}
	selectedPiece = {
		player : player,
		stackNumber: stackNumber,
		pieceSize : playerState[player].stacks[stackNumber],
		unplayed : true,
		data: player//=================================================================================================
	};
	isPieceSelected = true;
}

function selectPlayedPiece (player, square) {
	//상자 안쪽 piece 선택
	if (player !== boardState[square].squareStack[boardState[square].squareStack.length-1].player) {
		alert('상대 턴 입니다.');
		return;
	}
	selectedPiece = {
		player : boardState[square].squareStack[boardState[square].squareStack.length-1].player,
		pieceSize: boardState[square].squareStack[boardState[square].squareStack.length-1].pieceSize,
		unplayed : false,
		startingSquare: square,
		data:  boardState[square].squareStack[boardState[square].squareStack.length-1].player//=============================================
	};
	isPieceSelected = true;
}

function selectSquare(square) {  
	if (!isPieceSelected && boardState[square].squareStack[0]) {
		selectPlayedPiece(currentPlayer, square);
	} else if ((!boardState[square].squareStack[0] && isPieceSelected) || //작거나 빈곳 선택시
				(boardState[square].squareStack[0] && boardState[square].squareStack[boardState[square].squareStack.length-1].pieceSize < selectedPiece.pieceSize)){
					placePiece(square);
				} else if/*큰거선택시 */ (boardState[square].squareStack[0] && boardState[square].squareStack[boardState[square].squareStack.length-1].pieceSize >= selectedPiece.pieceSize){
		alert('작은 말을 선택하시오');
	} else { //아무대나 선택시
		alert('움직일 말을 선택하시오.');
	}
}
var arr=[];//=====================================================================================================


function placePiece(square) {
	boardState[square].squareStack.push({
		player : selectedPiece.player,
		pieceSize: selectedPiece.pieceSize,
		data: selectedPiece.data//================================================================================
	});

	var oldSquare = selectedPiece.startingSquare
	//선택한 피스를 보드 안에 추가
	$(`#square-${square}`).removeClass(function (int, className) {
		var initialClasses = className.split(" ");
		var finalClasses = [];
		for (var i=0; i < initialClasses.length; i++) {
			if (initialClasses[i].indexOf("player") === 0 || initialClasses[i].indexOf("size") === 0) {
				finalClasses.push(initialClasses[i]);
			} 
		} 
		return finalClasses.join(' ');
		
	}).addClass(`player-${currentPlayer} size-${selectedPiece.pieceSize}`);

	if (selectedPiece.unplayed){
		//선택한 보드바깥 피스 삭제
		$(`#player-${currentPlayer}-stack-${selectedPiece.stackNumber}`).hide();
	} else {
		//선택한 보드 안 피스 삭제
		$(`#square-${oldSquare}`).removeClass(function (int, className) {
			var initialClasses = className.split(" ");
			var finalClasses = [];
			for (var i=0; i < initialClasses.length; i++) {
				if (initialClasses[i].indexOf("player") === 0 || initialClasses[i].indexOf("size") === 0) {
					finalClasses.push(initialClasses[i]);
				} 
			}
			return finalClasses.join(' ');
		});
		boardState[oldSquare].squareStack.pop();//piece를 옮기기 위해 선택한 piece 삭제 하기위해 pop
		if (boardState[oldSquare].squareStack[boardState[oldSquare].squareStack.length-1] !== undefined){//말이 겹쳐있을 경우 맨 위 piece 이동 후 아래 있는 piece 다시 등장
			$(`#square-${oldSquare}`).addClass(`player-${boardState[oldSquare].squareStack[boardState[oldSquare].squareStack.length-1].player} 
				size-${boardState[oldSquare].squareStack[boardState[oldSquare].squareStack.length-1].pieceSize}`);
		}
	}
	isPieceSelected = false;
	selectedPiece = null;
	checkWinner(square);
	changeCurrentPlayer();
}

function checkWinner(square){
	//1행
		if(boardState[1].squareStack[boardState[1].squareStack.length-1] !== undefined && 
			boardState[0].squareStack[boardState[0].squareStack.length-1] !== undefined&&
			boardState[2].squareStack[boardState[2].squareStack.length-1] !== undefined&&
			boardState[0].squareStack[boardState[0].squareStack.length-1].player== 
			boardState[1].squareStack[boardState[1].squareStack.length-1].player&&
			boardState[2].squareStack[boardState[2].squareStack.length-1].player==
			boardState[1].squareStack[boardState[1].squareStack.length-1].player){
			alert(`player${boardState[1].squareStack[boardState[1].squareStack.length-1].player+1} win`);
		}
		//2행
		if(boardState[3].squareStack[boardState[3].squareStack.length-1] !== undefined && 
			boardState[4].squareStack[boardState[4].squareStack.length-1] !== undefined&&
			boardState[5].squareStack[boardState[5].squareStack.length-1] !== undefined&&
			boardState[3].squareStack[boardState[3].squareStack.length-1].player== 
			boardState[4].squareStack[boardState[4].squareStack.length-1].player&&
			boardState[3].squareStack[boardState[3].squareStack.length-1].player==
			boardState[5].squareStack[boardState[5].squareStack.length-1].player){
			alert(`player${boardState[4].squareStack[boardState[4].squareStack.length-1].player+1} win`);
		}
		//3행
		if(boardState[6].squareStack[boardState[6].squareStack.length-1] !== undefined && 
			boardState[7].squareStack[boardState[7].squareStack.length-1] !== undefined&&
			boardState[8].squareStack[boardState[8].squareStack.length-1] !== undefined&&
			boardState[6].squareStack[boardState[6].squareStack.length-1].player== 
			boardState[7].squareStack[boardState[7].squareStack.length-1].player&&
			boardState[8].squareStack[boardState[8].squareStack.length-1].player==
			boardState[6].squareStack[boardState[6].squareStack.length-1].player){
			alert(`player${boardState[7].squareStack[boardState[7].squareStack.length-1].player+1} win`);
		}
		//1열
		if(boardState[0].squareStack[boardState[0].squareStack.length-1] !== undefined && 
			boardState[3].squareStack[boardState[3].squareStack.length-1] !== undefined&&
			boardState[6].squareStack[boardState[6].squareStack.length-1] !== undefined&&
			boardState[0].squareStack[boardState[0].squareStack.length-1].player== 
			boardState[3].squareStack[boardState[3].squareStack.length-1].player&&
			boardState[6].squareStack[boardState[6].squareStack.length-1].player==
			boardState[3].squareStack[boardState[3].squareStack.length-1].player){
			alert(`player${boardState[3].squareStack[boardState[3].squareStack.length-1].player+1} win`);
		}
		//2열
		if(boardState[1].squareStack[boardState[1].squareStack.length-1] !== undefined && 
			boardState[4].squareStack[boardState[4].squareStack.length-1] !== undefined&&
			boardState[7].squareStack[boardState[7].squareStack.length-1] !== undefined&&
			boardState[1].squareStack[boardState[1].squareStack.length-1].player== 
			boardState[4].squareStack[boardState[4].squareStack.length-1].player&&
			boardState[7].squareStack[boardState[7].squareStack.length-1].player==
			boardState[4].squareStack[boardState[4].squareStack.length-1].player){
			alert(`player${boardState[4].squareStack[boardState[4].squareStack.length-1].player+1} win`);
		}
		//3열
		if(boardState[2].squareStack[boardState[2].squareStack.length-1] !== undefined && 
			boardState[5].squareStack[boardState[5].squareStack.length-1] !== undefined&&
			boardState[8].squareStack[boardState[8].squareStack.length-1] !== undefined&&
			boardState[2].squareStack[boardState[2].squareStack.length-1].player== 
			boardState[5].squareStack[boardState[5].squareStack.length-1].player&&
			boardState[8].squareStack[boardState[8].squareStack.length-1].player==
			boardState[5].squareStack[boardState[5].squareStack.length-1].player){
			alert(`player${boardState[5].squareStack[boardState[5].squareStack.length-1].player+1} win`);
		}
		//1대각
		if(boardState[0].squareStack[boardState[0].squareStack.length-1] !== undefined && 
			boardState[4].squareStack[boardState[4].squareStack.length-1] !== undefined&&
			boardState[8].squareStack[boardState[8].squareStack.length-1] !== undefined&&
			boardState[0].squareStack[boardState[0].squareStack.length-1].player== 
			boardState[4].squareStack[boardState[4].squareStack.length-1].player&&
			boardState[8].squareStack[boardState[8].squareStack.length-1].player==
			boardState[4].squareStack[boardState[4].squareStack.length-1].player){
			alert(`player${boardState[4].squareStack[boardState[4].squareStack.length-1].player+1} win`);
		}
		//2대각
		if(boardState[2].squareStack[boardState[2].squareStack.length-1] !== undefined && 
			boardState[4].squareStack[boardState[4].squareStack.length-1] !== undefined&&
			boardState[6].squareStack[boardState[6].squareStack.length-1] !== undefined&&
			boardState[2].squareStack[boardState[2].squareStack.length-1].player== 
			boardState[4].squareStack[boardState[4].squareStack.length-1].player&&
			boardState[6].squareStack[boardState[6].squareStack.length-1].player==
			boardState[4].squareStack[boardState[4].squareStack.length-1].player){
			alert(`player${boardState[4].squareStack[boardState[4].squareStack.length-1].player+1} win`);
		}
	
}
function changeCurrentPlayer(){
	if (currentPlayer === 0) {
		currentPlayer = 1;
	} else {
		currentPlayer = 0;
	}
}

$.when($.ready).then(function() {
	ClickHandlers();
	initBoardState();
});
