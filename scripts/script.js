import {
  reply_click_Container,
  renderHtml,
  deleteReply,
  addVote,
  downvote,
  addComment,
  editReply,
} from "./fxn.js";
export const comment_list = document.querySelector(".comments-container");
const form_area = document.querySelector(".comment-area");
const input_area = document.querySelector(".input_place");
export const modal = document.querySelector("#deleteModal");

export const comments = JSON.parse(localStorage.getItem("replyContent")) || [
  {
    id: 1,
    userName: "amyrobson",
    timestamp: "2024-05-01",
    vote: 12,
    comment:
      "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
    replies: [],
  },
  {
    id: 2,
    userName: "maxblagun",
    timestamp: "2024-05-15",
    vote: 5,
    comment:
      "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
    replies: [
      {
        id: 3,
        userName: "ramsesmiron",
        timestamp: "2024-05-22",
        vote: 4,
        repliedTo: "@maxblagun",
        comment:
          "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
      },
      {
        id: 4,
        userName: "juliusomo",
        timestamp: "2024-05-28",
        vote: 2,
        repliedTo: "@ramsesmiron",
        comment:
          "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
      },
    ],
  },
];

renderHtml();

comment_list.addEventListener("click", (e) => {
  if (e.target.closest(".delete-btn")) {
    const card = e.target.closest(".comment-card");
    const data_id = card.dataset.id;
    modal.classList.add("active");
    deleteReply(data_id);
  }

  if (e.target.closest(".reply-btn")) {
    const card = e.target.closest(".comment-card");
    const data_id = card.dataset.id;
    reply_click_Container(card, data_id);
  }

  if (e.target.closest(".edit-btn")) {
    const card = e.target.closest(".comment-card");
    const data_id = card.dataset.id;
    const commentBody = card.querySelector(".comment-body");
    const clone = commentBody.cloneNode(true);
    const mention = clone.querySelector(".mention");
    if (mention) mention.remove();
    const existingText = clone.innerText.trim();
    commentBody.style.display = "none";
    const textarea = document.createElement("textarea");
    textarea.className = "edit-textarea";
    textarea.value = existingText;
    const updateBtn = document.createElement("button");
    updateBtn.className = "btn-submit";
    updateBtn.textContent = "UPDATE";
    commentBody.insertAdjacentElement("afterend", textarea);
    textarea.insertAdjacentElement("afterend", updateBtn);
    updateBtn.addEventListener("click", () => {
      editReply(data_id, textarea);
    });
  }

  if (e.target.closest(".vote-btn[aria-label='Upvote']")) {
    const card = e.target.closest(".comment-card");
    const data_id = card.dataset.id;
    addVote(data_id);
  }

  if (e.target.closest(".vote-btn[aria-label='Downvote']")) {
    const card = e.target.closest(".comment-card");
    const data_id = card.dataset.id;
    downvote(data_id);
  }
});

form_area.addEventListener("submit", (e) => {
  e.preventDefault();
  const input_val = input_area.value.trim();
  addComment(input_val);
  input_area.value = "";
});
