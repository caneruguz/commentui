/* 
 *  Comment UI Js 
 *  Load after jquery and define within document.ready for events to work
*/

function CommentUI() {
	
/************************ VARIABLES  ************************/
	console.log('Log: Comments is running. '); 
	var top = this;
	
	this.commentMode = false; // Turn comment mode on and off. This gets checked at certain methods in the code below. 
	this.comments = new Array(); 
	this.currentUser = 34; // This will be the logged in user id 
	
	var element = ".wiki"; // the element that contains the text to be commented on 
	// on load rewrite the element text to include id	
	var newcontent = top.AddSpan(element); 
	top.Band(); //initiate band related events;
	
	// Load existing json into an array of objects
	$.ajax({
	  dataType: "json",
	  url: "data.json",
	  success: function(data){
		  top.comments = data; 
		  console.log(top.comments);
		  top.ListComments('load');  
	  },
	 error : function(xhr, status) {// If there was an error
            console.log('There was an error talking to data.json');
            console.log(xhr);
            console.log(status);
        } 
	});

	
/************************  EVENTS  ************************/
	
	/* Toggle Comment bar  when the pulltab is clicked */ 	
      $('.cm-pullTab').on('click', function(){
            var cm = $(this); 
            // toggle comment box
            top.ToggleCM(cm); 
            // turn comment mode on.
            
 			});	
	 $(element).html(newcontent);		

	/* Events for clicking on a sentence */ 	
      $('.sentence').on('click', function(){
		  var unid = $(this).attr('unid'); // get the unid
		  // show other comments on this sentence
 		});	

 		/*  Adding Cooments */
 		$('.cm-addComment').on('click', function(){
 			var content = $(this).siblings('textarea').val(); 
 			var newcomment = {
	 				  "id" : top.comments.comments.length+1,
					  "userid" : top.currentUser,
					  "username" : "Jennie",
					  "content" : content,
					  "replySource" : 0, // this is 0 because it's a top level comment
					  "textSource" : 0 // this is 0 because it's not a comment on a sentence, but this might take its value from the parent
 			}; 
 			top.comments.comments.push(newcomment); 
 			top.ListComments('load'); 
 		}); 


	/* Filtering event */  		
		$('.cm-filter').keyup( function(){
		         var text = $(this).val();
		         text = text.toLowerCase();                         
		         if(text.length > 0){
                   	top.ListComments('filter');  // do search view -- flatten comments
                   	$('.cm-commentBox').each(function(){
                             var content = $(this).text();
                             content = content.toLowerCase();                          
                             var exists = content.indexOf(text); 
                             if(exists != -1){
                                     $(this).fadeIn(); 
                             } else {
                                     $(this).fadeOut();
                             }
					    });                       
		         } else {
					 top.ListComments('load'); // return to normal state
		         }
		 });

}

/************************ METHODS  ************************/
 
CommentUI.prototype.ToggleCM = function(cm){
	var main = this;
    if(cm.parent().hasClass('cm-active')){
            cm.parent().removeClass('cm-active').animate({
                    right: "-300"
                    // add other animations                                
                    }, 100, function() {
                // Animation complete.
              });
              main.commentMode = false;
            main.CommentMode();
    } else {
            cm.parent().addClass('cm-active').animate({
                    right: "0"
                    // add other animations                                
                    }, 100, function() {
                // Animation complete.
              });
              main.commentMode = true;
            main.CommentMode();
    }	

}

CommentUI.prototype.AddSpan = function(el){
	var main = this;
	var content, sentences, i, newcontent; 
	
	content  = $(el).html(); 	
	sentences = content.split("."); 
	newcontent = "";  
	 
	for (i = 0; i < sentences.length; i++){
		var m = sentences[i]; 
		newcontent += "<span unid='"+(i+1)+"' class='sentence'>"+m+".</span>"; 
	}	
	return newcontent; 
}


CommentUI.prototype.CommentMode = function(){
	var main = this;

	if(main.commentMode == true){
		 $('.sentence').on('mouseenter',  function(){
			 $(this).css('background','#FDFCD7');
			 })
			 .on('mouseleave', '.sentence', function(){
			 $(this).css('background','#fff');
			 })
	 } else {

		 $('.sentence').off('mouseenter').off('mouseleave');
	 }
}



CommentUI.prototype.ListComments = function(view){
	var main = this;
	var comments = main.comments.comments;
	console.log(comments);  

	if(view == 'filter'){
		// empty the div first
		$('.cm-wrapper').html(''); 
		for(var i = 0; i < comments.length; i++){
			var m = comments[i]; 		
			$('.cm-wrapper').append("<div class='cm-commentBox'> <div class='cm-commentText' postid='"+m.id+"' source='"+m.textSource+"'><b>"+m.username+" </b><br /> "+m.content+"</div> </div>")
		} 
	
	} else if (view == 'load')	{
		// empty the div first
		$('.cm-wrapper').html(''); 
		for(var i = 0; i < comments.length; i++){
			var m = comments[i]; 		
			var selector = 'div[postid="' + m.replySource + '"]';
			$(selector).append("<div class='cm-commentBox'> <div class='cm-commentText' postid='"+m.id+"' source='"+m.textSource+"'><b>"+m.username+" </b><span class='cm-boxMenu cm-reply' postid='"+m.id+"'><span class='icon-comments-alt'></span> Reply</span><br /> "+m.content+"</div> </div>")
		} 		
	}


 		$('.cm-commentText').on('click', function(){
	 		var sentence = $(this).attr('source'); // get the id
	 		$('.sentence').removeClass('highlight animated flash');
	 		if(sentence != 0){
	 		var selector = 'span[unid="' + sentence + '"]';// define selector
		 		console.log(selector); 
		 		$(selector).addClass('highlight animated flash');
		 		// scrollto  to selector
	            $.scrollTo($(selector), 400, {
	                offset : -100
	            });		 		
	 		}
 		})
 		
 		/* Event for Showing Reply form */ 
 		$(document).on('click', '.cm-reply', function(event){
 			event.stopImmediatePropagation();
	 		var id = $(this).attr('postid'); // this is very clumsy, but trying to debug. 
	 		$(this).parent().append('<div class="cm-replyWrapper"><textarea class="cm-replyBox"></textarea> <button class="cm-addReply btn btn-primary btn-small" postid='+id+'>Add Reply</button> <button class="cm-cancel btn btn-info btn-small">Cancel</button> </div>'); 	
 		}); 
 		
 		/*  Adding Reply */
 		$(document).on('click', '.cm-addReply', function(event){
 			event.stopImmediatePropagation();
 			var content = $(this).siblings('textarea').val(); 
/*  			var replySource = parseInt($(this).closest('.cm-commentText').attr('postid'));  */
 			var id = $(this).attr('postid'); 
 			var newcomment = {
	 				  "id" : main.comments.comments.length+1,
					  "userid" : main.currentUser,
					  "username" : "Jennie",
					  "content" : content,
					  "replySource" : id, // this is 0 because it's a top level comment
					  "textSource" : 0 // this is 0 because it's not a comment on a sentence, but this might take its value from the parent
 			}; 
 			main.comments.comments.push(newcomment); 
 			main.ListComments('load'); 
 			$('.cm-replyWrapper').remove(); 	 		
 		}); 

 		/*  Canceling  Reply */
 		$(document).on('click', '.cm-cancel', function(event){
 			event.stopImmediatePropagation();
  			$(this).parent().remove(); 	 		
 		});  	
 			
}




CommentUI.prototype.Band = function(){
	var main = this;
	
/* Band and resizing related events -- TODO */


}







