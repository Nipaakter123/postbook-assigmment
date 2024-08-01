 const showLoggedUsername = () =>{    
     const userNameElement = document.
     getElementById("logged-username");

    // find username from localstorage
    
    let user = localStorage.getItem('loggedInUser');
    if(user){
        user = JSON.parse(user);
    }


    // show username in the webpage

    userNameElement.innerText =user.userName;
    };

    const checkLoggedInUser = () => {
        let user =  localStorage.getItem('loggedInUser');
        if(user){
            user = JSON.parse(user);
        }
        else{
            window.location.href = "/index.html";
        }
    };

    const logOut = () =>{
        // clearing the localstorage
        localStorage.clear();
        checkLoggedInUser();
    };

 const fetchAllposts = async() =>{
    let data;
    try{
    const res = await fetch("http://localhost:5000/getAllposts");
    data = await res.json();
    console.log(data);
    showAllposts(data);
    }
    catch(err){
     console.log("Error fetching  data from server");
    }
};

const showAllposts = (allposts) =>{
 const postContainer =document.getElementById("post-container");
 postContainer.innerHTML = "";

 allposts.forEach(async (post) => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    postDiv.innerHTML =`
      <div class="post-header">
        <div class="post-user-image">
            <img
             src=${post.postedUserImage}
             />

        </div>

        <div class="post-username-time">
           <p class="post-username">${post.postedUserName}</p>
           <div class="posted-time">
            <span>${timeDifference(`${post.postedTime}`)}</span>
            <span>ago</span>
           </div>
        </div>
    </div>

    <div class="post-text">

        <p class="post-text-content">
         ${post.postText}
        </p>
    </div>

    <div class="post-image">
     
        <img src=${post.postImageUrl}
        />
    </div>
    `;

    postContainer.appendChild(postDiv);

    //comments under a post

     let postcomments= await fetchAllcommentsOfApost(post.postId);
     console.log("postComments:",postcomments);

     postcomments.forEach((Comment) =>{
        const commentsHolderDiv = document.createElement("div");
        commentsHolderDiv.classList.add("comments-holder");

        commentsHolderDiv.innerHTML = `
        <div class="comment">
            <div class="comment-user-image">
                <img src=${Comment.commentedUserImage}
                />
            </div>
            <div class="comment-text-container">
                <h4>${Comment.commentedUserName}</h4>
                <p class="comment-text">
                    ${Comment. commentText}
                </p>
            </div>
        </div>
        `;

        postDiv.appendChild(commentsHolderDiv);
     });


     // adding a new comment to the post

     const addNewCommentDiv = document.createElement('div');
     addNewCommentDiv.classList.add("postComment-holder");

     addNewCommentDiv.innerHTML=`
         <div class="post-comment-input-field-holder">
            <input 
            type="text" 
             placeholder="Post your comments"
             class="postComment-input-field"
             id="postComment-input-for-postId-${post.postId}"
             />
         </div>
         <div class="comment-btn-holder">
            <button onClick=handlePostComment(${post.postId}) id="comment-btn" class="postComment-btn">Comment</button>
         </div>`;

      postDiv.appendChild(addNewCommentDiv);
 });
 };

    const handlePostComment = async(postId) =>{
        // collecting logged in user ID from localstorage

        let user = localStorage.getItem("loggedInUser");
        if(user){
            user = JSON.parse(user);
        }
        
        console.log("user:",user);
        const commentedUserId = user.userId;

        // getting comment text from input

        const commentTextElement = document.getElementById(`postComment-input-for-postId-${postId}`);

        const commentText = commentTextElement.value;

        // current time of the comment

        let now = new Date();

        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        let timeOfComment = now.toISOString();

        const commentObject = {
            commentpostId : postId,
            commentedUserId : commentedUserId,
            commentText:commentText,
            commentedTime:timeOfComment,
        };

        try{
            const res = await fetch("http://localhost:5000/postComment",{
                method:'POST',
                headers:{
                 "content-type": "application/json" ,
                },
                body:JSON.stringify(commentObject),
            });

            const data = await res.json();
        }
        catch(err){
            console.log("error while sending data to the server :", err );
        }
        finally{
            location.reload();
        }
 };

const fetchAllcommentsOfApost = async (postId) =>{
    console.log(postId);
 let commentsOfpost = [];
 try{
 const res =await fetch(`http://localhost:5000/getAllComments/${postId}`);
 commentsOfpost =await res.json();
 }
 catch(err){
 console.log("Error fetching comments from the server",err);
 }
 
 finally{
    return commentsOfpost;
 }
};

const handleAddNewPost = async() =>{
    //getting user id from localstorage 

    let user = localStorage.getItem("loggedInUser");
        if(user){
            user = JSON.parse(user);
        }
        
        console.log("user:",user);
        const postedUserId = user.userId;

         // current time of the post

         let now = new Date();

         now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

         let timeOfpost = now.toISOString();

         //post text
         
         const postTextElement = document.getElementById("newPost-text");
         const postText = postTextElement.value;

        //post image

        const postImageElement = document.getElementById("newPost-image");
        const postImageUrl	= postImageElement.value;

        // creating a post object 

        const postObject = {
            postedUserId : postedUserId,
            postedTime : timeOfpost,
            postText : postText ,
            postImageUrl: postImageUrl,
        };

        try{
            const res = await fetch("http://localhost:5000/addNewPost",{
                method:'POST',
                headers:{
                 "content-type": "application/json" ,
                },
                body:JSON.stringify(postObject),
            });

            const data = await res.json();
        }
        catch(err){
            console.log("error while sending data to the server :", err );
        }
        finally{
            location.reload();
        }
 
};
// this function automatically runs
fetchAllposts();

