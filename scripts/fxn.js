import { comment_list, comments, modal } from "./script.js";

const currentUser = "juliusomo";

export function reply_click_Container(card, card_id) {
  const existing = document.querySelector(".reply-area");
  if (existing) existing.remove();

  const container = document.createElement("form");
  container.className = "reply-area";

  container.innerHTML = `
  <img src="assests/images/image-juliusomo.png" alt="Your avatar" class="avatar">
  <textarea name="new-comment" placeholder="Add a comment" aria-label="Add a commnet" class="input_place" required></textarea>
  <button type="submit" class="btn-submit">SEND</button>`;
  card.insertAdjacentElement("afterend", container);
  container.addEventListener("submit", (e) => {
    e.preventDefault();
    const textinput = container.querySelector(".input_place").value.trim();
    addReply(card_id, textinput);
    if (container) container.remove();
  });
}

function addReply(id, input_text) {
  const val = Number(id);
  const index = comments.findIndex((data) => data.id === val);
  if (index !== -1) {
    comments[index].replies.push({
      id: Date.now(),
      userName: currentUser,
      timestamp: new Date().toISOString(),
      vote: 0,
      repliedTo: `@${comments[index].userName}`,
      comment: input_text,
    });
  } else {
    const parentComment = comments.find((data) =>
      data.replies.some((reply) => reply.id === val),
    );

    if (parentComment) {
      const clickedReply = parentComment.replies.find(
        (reply) => reply.id === val,
      );
      parentComment.replies.push({
        id: Date.now(),
        userName: currentUser,
        timestamp: new Date().toISOString(),
        vote: 0,
        repliedTo: `@${clickedReply.userName}`,
        comment: input_text,
      });
    }
  }

  renderHtml();
}

function reply_container(data) {
  let replyHtml = `<div class="replies-container">`;

  data.replies.forEach((reply) => {
    replyHtml += `
      <article class="comment-card" data-id=${reply.id}>
        <div class="comment-votes">
          <button type="button" class="vote-btn" aria-label="Upvote">
            <img src="assests/icon-plus.svg" alt="">
          </button>
          <p class="vote-count">${reply.vote}</p>
          <button type="button" class="vote-btn" aria-label="Downvote">
            <img src="assests/icon-minus.svg" alt="">
          </button>
        </div>
        <div class="comment-part">
          <header class="comment-header">
            <div class="user-info">
              <img src="assests/images/image-${reply.userName}.png" alt="${reply.userName} avatar" class="avatar">
              <span class="name">${reply.userName}</span>
              ${
                reply.userName === currentUser
                  ? `<span class="badge-you">you</span>`
                  : ""
              }
              <span class="comment-time">${timeAgo(reply.timestamp)}</span>
            </div>
            ${
              reply.userName === currentUser
                ? `<div class="msg-edit-section">
                    <button type="button" class="btn-action delete-btn">
                      <img src="assests/icon-delete.svg" alt="">Delete
                    </button>
                    <button type="button" class="btn-action edit-btn">
                      <img src="assests/icon-edit.svg" alt="">Edit
                    </button>
                  </div>`
                : `<button type="button" class="btn-action reply-btn" aria-label="Reply">
                    <img src="assests/icon-reply.svg" alt="">Reply
                  </button>`
            }
          </header>
          <p class="comment-body">
            <span class="mention">${reply.repliedTo}</span>
            ${reply.comment}
          </p>
        </div>
      </article>`;
  });

  replyHtml += `</div>`;
  return replyHtml;
}

export function renderHtml() {
  saveToStorage();
  let html = "";

  comments.forEach((data) => {
    if (data.replies.length === 0) {
      html += `
        <article class="comment-card" data-id=${data.id}>
          <div class="comment-votes">
            <button type="button" class="vote-btn" aria-label="Upvote">
              <img src="assests/icon-plus.svg" alt="">
            </button>
            <p class="vote-count">${data.vote}</p>
            <button type="button" class="vote-btn" aria-label="Downvote">
              <img src="assests/icon-minus.svg" alt="">
            </button>
          </div>
          <div class="comment-part">
            <header class="comment-header">
              <div class="user-info">
                <img src="assests/images/image-${data.userName}.png" alt="${data.userName} avatar" class="avatar">
                <span class="name">${data.userName}</span>
                ${
                  data.userName === currentUser
                    ? `<span class="badge-you">you</span>`
                    : ""
                }
                <span class="comment-time">${timeAgo(data.timestamp)}</span>
              </div>
              ${
                data.userName === currentUser
                  ? `<div class="msg-edit-section">
                      <button type="button" class="btn-action delete-btn">
                        <img src="assests/icon-delete.svg" alt="">Delete
                      </button>
                      <button type="button" class="btn-action edit-btn">
                        <img src="assests/icon-edit.svg" alt="">Edit
                      </button>
                    </div>`
                  : `<button type="button" class="btn-action reply-btn" aria-label="Reply">
                      <img src="assests/icon-reply.svg" alt="">Reply
                    </button>`
              }
            </header>
            <p class="comment-body">
              ${data.comment}
            </p>
          </div>
        </article>`;
    } else {
      html += `
        <div class="comment-thread">
          <article class="comment-card" data-id=${data.id}>
            <div class="comment-votes">
              <button type="button" class="vote-btn" aria-label="Upvote">
                <img src="assests/icon-plus.svg" alt="">
              </button>
              <p class="vote-count">${data.vote}</p>
              <button type="button" class="vote-btn" aria-label="Downvote">
                <img src="assests/icon-minus.svg" alt="">
              </button>
            </div>
            <div class="comment-part">
              <header class="comment-header">
                <div class="user-info">
                  <img src="assests/images/image-${data.userName}.png" alt="${data.userName} avatar" class="avatar">
                  <span class="name">${data.userName}</span>
                  ${
                    data.userName === currentUser
                      ? `<span class="badge-you">you</span>`
                      : ""
                  }
                  <span class="comment-time">${timeAgo(data.timestamp)}</span>
                </div>
                ${
                  data.userName === currentUser
                    ? `<div class="msg-edit-section">
                        <button type="button" class="btn-action delete-btn">
                          <img src="assests/icon-delete.svg" alt="">Delete
                        </button>
                        <button type="button" class="btn-action edit-btn">
                          <img src="assests/icon-edit.svg" alt="">Edit
                        </button>
                      </div>`
                    : `<button type="button" class="btn-action reply-btn" aria-label="Reply">
                        <img src="assests/icon-reply.svg" alt="">Reply
                      </button>`
                }
              </header>
              <p class="comment-body">
                ${data.comment}
              </p>
            </div>
          </article>

          ${reply_container(data)}
        </div>`;
    }
  });

  comment_list.innerHTML = html;
}

function saveToStorage() {
  localStorage.setItem("replyContent", JSON.stringify(comments));
}

export function deleteReply(id) {
  modal.addEventListener("click", (e) => {
    if (e.target.closest("#cancelDelete")) {
      modal.classList.remove("active");
      return;
    }

    if (e.target.closest("#confirmDelete")) {
      const val = Number(id);
      const topIndex = comments.findIndex((data) => data.id === val);
      if (topIndex != -1) {
        comments.splice(topIndex, 1);
      } else {
        const parentComment = comments.find((data) => {
          return data.replies.some((reply) => reply.id === val);
        });
        const replyIndex = parentComment.replies.findIndex(
          (reply) => reply.id === val,
        );

        parentComment.replies.splice(replyIndex, 1);
      }
      modal.classList.remove("active");
      renderHtml();
    }
  });
}

export function addVote(id) {
  const val = Number(id);
  const topIndex = comments.findIndex((data) => data.id === val);
  if (topIndex != -1) {
    comments[topIndex].vote += 1;
  } else {
    const parentComment = comments.find((data) => {
      return data.replies.some((reply) => reply.id === val);
    });

    const addIndex = parentComment.replies.find((reply) => reply.id === val);
    addIndex.vote += 1;
  }

  renderHtml();
}

export function downvote(id) {
  const val = Number(id);
  const topIndex = comments.findIndex((data) => data.id === val);
  if (topIndex != -1) {
    comments[topIndex].vote -= 1;
    if (comments[topIndex].vote < 0) comments[topIndex].vote = 0;
  } else {
    const parentComment = comments.find((data) => {
      return data.replies.some((reply) => reply.id === val);
    });

    const addIndex = parentComment.replies.find((reply) => reply.id === val);
    addIndex.vote -= 1;
    if (addIndex.vote < 0) addIndex.vote = 0;
  }

  renderHtml();
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (let key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value >= 1) {
      return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}

export function addComment(input_data) {
  comments.push({
    id: Date.now(),
    userName: currentUser,
    timestamp: new Date().toISOString(),
    vote: 0,
    comment:
     input_data,
    replies: [],
  });

  renderHtml();
}


export function editReply(id,textarea){
  const input_val = textarea.value.trim();
  if (!input_val) return;
  const val = Number(id);
  const topIndex = comments.findIndex((data)=> data.id === val);
  if(topIndex !== -1){
    comments[topIndex].comment = input_val;
  }else{
     const parentComment = comments.find((data)=>{
      return data.replies.some((reply) => reply.id === val);
     })

     const reply_body = parentComment.replies.find((data)=> data.id === val);
     reply_body.comment = input_val;
  }

  renderHtml();
}



