var size;
var similarMatr = [];
var eps;

function SetValsFromForm(){
	size = document.getElementById("InSize").value;
	eps = document.getElementById("eps").value;
}

function CreateMatrix() {
	var table = document.getElementById('InputMatr');
	if (document.getElementById("tbl") !== null) {
		document.getElementById("tbl").outerHTML = "";
	}
	var tbl = document.createElement('table');
	tbl.setAttribute('id','tbl');
	tbl.style.width  = '40px';
	tbl.style.border = '1px black';
	tbl.style.float = 'left';
	el = [];
	for(var i = 0; i < size; i++){
		var tr = tbl.insertRow();
		let td;
		el[i] = [];
		for(var j = 0; j < size; j++){
			td = tr.insertCell();
			el[i][j] = document.createElement('input');
			el[i][j].value = 0 ;
			if (i > j){
				el[i][j] = document.createElement('input');
				el[i][j].readOnly = true;
				el[i][j].value = 'autofill';
			}
			td.appendChild(el[i][j]);
			td.style.border = '1px black';
		}
	table.appendChild(tbl);
	}
}

function MatrixComplementation(){
	for(var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){
			if (i > j){
				if (el[i][j].value != el[j][i].value){
					el[i][j].value = el[j][i].value;
				}
			}
		}
	}

}

function OutputMatrix(A) {
	var table = document.getElementById('OutputMatr');
	if (document.getElementById("ansTbl") !== null) {
		document.getElementById("ansTbl").outerHTML = "";
	}
	var tbl = document.createElement('table');
	tbl.setAttribute('id','ansTbl');
	tbl.style.width  = '40px';
	tbl.style.border = '1px black';
	tbl.style.float = 'left';
	var el = [];
	for(var i = 0; i < size; i++){
		var tr = tbl.insertRow();
		let td;
		el[i] = [];
		for(var j = 0; j < size; j++){
		td = tr.insertCell();
				el[i][j] = document.createElement('input');
				if (i != j){
					el[i][j].value = A[i][j].toExponential(2);
				}else{
					el[i][j].value = A[i][j];
				}
				td.appendChild(el[i][j]);
				td.style.border = '1px black';
			   }
	table.appendChild(tbl);
	}
}

function getRandom(){
    var min = -Math.pow(10,2);
    var max = Math.pow(10,2);
    return Math.floor(Math.random()*(max-min))+min;
}

function SetRandomVals(){
	for(var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){
			if (i==j)
				el[i][j].value = getRandom();
			else
				el[i][j].value = el[j][i].value = getRandom();
		}
	}	
}

function GetValsFromForm(){
	for(var i = 0; i < size; i++){
		similarMatr[i] = [];
		for(var j = 0; j < size; j++){
			similarMatr[i][j] = el[i][j].value;
		}
	}	
}

function FindMax(A){
	var max = A[0][1];
	var iMax = 0, jMax = 1;
	for(var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){
			if (i < j && Math.abs(max) < Math.abs(A[i][j])){ 
				max = A[i][j];
				iMax = i;
				jMax = j;
			}
		}
	}
	return [iMax, jMax, max];
}

function YakobiMethod(){
	var max = [];
	max = FindMax(similarMatr);
	var phi, result;
	var H, vector = [];
	for(var i = 0; i < size; i++){
		vector[i] = [];
		for(var j = 0; j < size; j++){
			if (i === j){
				vector[i][j] = 1;
			}else{
				vector[i][j] = 0;
			}
		}
	}
	while (Math.abs(max[2])>eps){
		if (similarMatr[max[0]][max[0]] == similarMatr[max[1]][max[1]]){
			phi = Math.Pi/4; 
		}else{
			phi = Math.atan(2*(similarMatr[max[0]][max[1]])/((similarMatr[max[0]][max[0]])-(similarMatr[max[1]][max[1]])))/2;
		}
		result = JakobiRotation(similarMatr,phi,max[0],max[1],size);
		similarMatr = result[0];
		H = result [1];
		vector = MultiplyMatrix(vector,H);
		max = FindMax(similarMatr);
	}
	OutputMatrix(similarMatr);
	AnswerNumbers(similarMatr);
	AnswerVectors(vector);
}

function JakobiRotation(A,theta,maxI,maxJ,size){
	var c = Math.cos(theta);
	var s = Math.sin(theta);
	var newMatr = [];
	var H = [];
	var HT = [];
	for(var i = 0; i < size; i++){
		newMatr[i] = [];
		H[i] = [];
		HT[i] = [];
		for(var j = 0; j < size; j++){
			if (i === j){
				H[i][j] = 1;
			}
			else{
				H[i][j] = 0;
			}
			if ((i === maxI) && (j === maxI)){
				H[i][j] = c;}
			if ((i === maxJ) && (j === maxI)){
				H[i][j] = s;
			} 
			if ((i === maxI) && (j === maxJ)){
				H[i][j] = -1*s;
			}
			if ((i === maxJ) && (j === maxJ)){
				H[i][j] = c;
			}
		}
		HT = TransMatrix(H);
	}
	newMatr = MultiplyMatrix(HT,A)
	newMatr = MultiplyMatrix(newMatr,H)
	return [newMatr, H];
}

function TransMatrix(A)       
{
    var m = A.length, n = A[0].length, AT = [];
    for (var i = 0; i < n; i++){ 
		AT[i] = [];
       	for (var j = 0; j < m; j++) AT[i][j] = A[j][i];
    }
    return AT;
}

function MultiplyMatrix(A,B)
{
    var rowsA = size, colsA = size,
        rowsB = size, colsB = size,
        C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[i] = [];
    for (var k = 0; k < colsB; k++){ 
		for (var i = 0; i < rowsA; i++){ 
			var t = 0;
          	for (var j = 0; j < rowsB; j++) t += A[i][j]*B[j][k];
          	C[i][k] = t;
        }
    }
    return C;
}

function AnswerNumbers(A){
	var numbers = [];
	for (var i = 0; i < size; i++){ 
       	for (var j = 0; j < size; j++){
			if (i === j){
				numbers[i] = A[i][j];
			}
		}
	}
	var table = document.getElementById('AnsNum');
	if (document.getElementById("tblNum") !== null) {
		document.getElementById("tblNum").outerHTML = "";
	}
	var tbl = document.createElement('table');
	tbl.setAttribute('id','tblNum');
	tbl.style.width  = '40px';
	tbl.style.border = '1px black';
	tbl.style.float = 'left';
	var el = [];
	var tr = tbl.insertRow();
	for(var i = 0; i < size; i++){
		td = tr.insertCell();
		el[i] = document.createElement('input');
		el[i].value = numbers[i];
		td.appendChild(el[i]);
    	td.style.border = '1px black';
	}
	table.appendChild(tbl);
}

function AnswerVectors(A){
	var table = document.getElementById('VecNum');
	if (document.getElementById("tblVec") !== null) {
		document.getElementById("tblVec").outerHTML = "";
	}
	var tbl = document.createElement('table');
	tbl.setAttribute('id','tblVec');
	tbl.style.width  = '40px';
	tbl.style.border = '1px black';
	tbl.style.float = 'left';
	tbl.style.borderSpacing = '75px 0px';
	var el = [];
	for(var i = 0; i < size; i++){
		var tr = tbl.insertRow();
		let td;
		el[i] = [];
		for(var j = 0; j < size; j++){
			td = tr.insertCell();
			el[i][j] = document.createElement('input');
			el[i][j].value = A[i][j];
			td.appendChild(el[i][j]);
			td.style.border = '1px black';
		}
	table.appendChild(tbl);
	}
}
