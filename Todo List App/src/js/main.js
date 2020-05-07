var db;
var ID = 1;
var DB_SIZE = 5*1024*1024;	

//Open Database
function openDatabse(){

	db = openDatabase('Database','1.0','Todo Database',DB_SIZE)

	//Browser Support Control
	if(db) console.log('Open Database')
	else{ 
		alert('Not Support Browser Version')
		$('body').css('display','none')
		}

	//Create Table
	db.transaction(function(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS todos (id unique, todo)');
	})

}

//Animation
function anim(){

	$('body').css('display','block')
	$('.list').addClass('animated bounceInDown')
	$('.list').css('display','block')
	$('.form__group').addClass('animated bounceInDown')
	$('.form__group').css({
		'width':'50%',
		'margin-left':'25%',
		'margin-right':'25%',
		'margin-top':'10%',
		'margin-bottom':'1vw'
	})

}

//Get Data
function getData(){

	db.transaction(function(tx){

		tx.executeSql('SELECT * FROM todos',[],function(tx,rs){
			for(var i = 0; i<rs.rows.length;i++){
				if(i > -1) anim()
				var row = rs.rows.item(i)
				this.ID = row.id
				this.ID++

				//Add Html
				$('.list').append(`<div class="todo" id="todo${row.id}">${row.todo}<a href="#" onclick="deleteTodo(${row.id})"><i class="material-icons md-18">clear</i></a></div>`)
			}
		})

	})
	$('.list').empty()
}

//Add Todo
function addTodo(){

   db.transaction(function(tx){
   			var todo = $(".form__input").val()
			tx.executeSql('INSERT INTO todos (id, todo) VALUES (?,?)',[this.ID,todo]);
			$('.form__input').val('')
	})
}


//Delete Todo
function deleteTodo(e){
	$('#todo'+e).addClass('animated bounceOutDown')
	db.transaction(function(tx){
		tx.executeSql('DELETE FROM todos WHERE id=?',[e])
	})
	setTimeout(function(){$('#todo'+e).remove()}, 800)

}

//Ready Page
$(document).ready(function(){

	//Animated
	$('.form__group').addClass('animated bounceIn')

	//Open Database
	openDatabse();

	//Get Data
	getData();

})

//Press Enter
$(document).on('keypress',function(e) {

	if(e.which == 13){

		//Add Todo
		addTodo();

		//Get Data
		getData();
	}

})