<template>
  <div id="app">
    <!-- Desktop design -->
    <div
      class="p-d-flex p-flex-column p-ai-end desktop-container"
      v-if="windowWidth > 400"
    >
      <!-- v for div -->
      <div
        class="p-d-flex p-flex-column p-ai-end"
        v-for="(comment, index) in data.comments"
        :key="index"
        style="width: 100%"
      >
        <div
          style="min-width: 70%; background: white"
          class="p-d-flex rounded-1 p-mt-3"
        >
          <div
            style="width: 5%"
            class="p-mx-auto p-mb-auto p-mt-3 p-py-2 bg-lightgrey p-text-center rounded-1"
          >
            <i class="fa-solid fa-plus counter-sign"></i>
            <h4 class="p-my-3">{{ comment.score }}</h4>
            <i class="fa-solid fa-minus counter-sign"></i>
          </div>
          <Card style="width: 90%">
            <template #header>
              <div class="p-d-flex">
                <img
                  class="p-as-center p-ml-1"
                  style="width: 6%; height: 10%"
                  :src="comment.user.image.png"
                />
                <h4 class="p-mx-3">{{ comment.user.username }}</h4>
                <p class="p-as-center">{{ comment.createdAt }}</p>

                <!-- Delete and edit comment if user is juliusomo -->
                <div
                  v-if="comment.user.username == 'juliusomo'"
                  class="p-ml-auto p-mr-4 p-d-flex p-ai-center"
                >
                  <div
                    @click="deleteReply(comment.id)"
                    class="p-mr-3 red-and-cursor"
                  >
                    <i class="fa-solid fa-trash p-mr-2"></i>
                    <span>Delete</span>
                  </div>

                  <div @click="editReply(comment.id)">
                    <i class="fa-solid fa-pen p-mr-2 color-m-blue"></i>
                    <span>Edit</span>
                  </div>
                </div>
                <!-- else other users -->
                <h4
                  v-else
                  @click="showReply(comment.id)"
                  class="p-ml-auto p-mr-4 color-m-blue"
                >
                  <i class="fa-solid fa-reply"></i>
                  Reply
                </h4>
              </div>
            </template>
            <template #content class="repyl-content">
              <Textarea
                :id="comment.id"
                disabled
                :value="reply.editedReply || comment.content"
                class="remove-disabled-effects"
                :autoResize="true"
                style="width: 95%"
              />
              <div class="p-d-flex p-mb-3 p-mt-2">
                <Button
                  v-if="comment.isEditing"
                  label="UPDATE"
                  class="p-ml-auto p-mr-3 p-mt-2 p-mb-0 rounded-1 m-blue"
                  @click="updateReply(comment.id)"
                />
              </div>
            </template>
          </Card>
        </div>
        <!-- If replies -->
        <div
          class="p-d-flex p-flex-column p-ai-end"
          v-if="comment.replies.length > 0"
          style="width: 100%"
        >
          <div
            class="p-d-flex bg-white p-mt-3 rounded-1 p-px-3"
            v-for="(reply, index) in comment.replies"
            :key="index"
            style="width: 60%"
          >
            <div
              style="width: 7%"
              class="p-mb-auto p-mx-auto p-mt-5 p-py-2 bg-lightgrey p-text-center rounded-1"
            >
              <i class="fa-solid fa-plus counter-sign"></i>
              <h4 class="p-my-3">{{ reply.score }}</h4>
              <i class="fa-solid fa-minus counter-sign"></i>
            </div>
            <Card class="p-mt-3" style="width: 90%">
              <template #header>
                <div class="p-d-flex p-ai-center">
                  <img
                    class="p-ml-3 p-mr-1"
                    style="width: 6%; height: 10%"
                    :src="reply.user.image.png"
                    alt=""
                  />
                  <h4 class="p-mx-2">{{ reply.user.username }}</h4>
                  <p v-if="reply.user.username == 'juliusomo'" class="you-tag">
                    you
                  </p>
                  <p class="p-ml-1">{{ reply.createdAt }}</p>
                  <!-- Delete and edit instead of reply if user is juliusomo -->
                  <div
                    v-if="reply.user.username == 'juliusomo'"
                    class="p-ml-auto p-mr-2 p-d-flex p-ai-center"
                  >
                    <div
                      @click="deleteReply(comment.id, reply.id)"
                      class="p-mr-3 red-and-cursor"
                    >
                      <i class="fa-solid fa-trash p-mr-2"></i>
                      <span>Delete</span>
                    </div>

                    <div @click="editReply(comment.id, reply.id)">
                      <i class="fa-solid fa-pen p-mr-2 color-m-blue"></i>
                      <span>Edit</span>
                    </div>
                  </div>
                  <!-- else other users -->
                  <h4 v-else class="p-ml-auto p-mr-2 color-m-blue">
                    <i class="fa-solid fa-reply"></i>
                    Reply
                  </h4>
                </div>
              </template>

              <template #content class="reply-content">
                <Textarea
                  :id="reply.id"
                  disabled
                  :value="
                    reply.editedReply || '@' + reply.replyingTo + reply.content
                  "
                  class="p-mr-5 p-ml-2 remove-disabled-effects"
                  :autoResize="true"
                  rows="2"
                  style="width: 100%"
                />
                <div class="p-d-flex p-mb-3 p-mt-2">
                  <Button
                    v-if="reply.isEditing"
                    label="UPDATE"
                    class="p-ml-auto rounded-1 m-blue"
                    @click="updateReply(comment.id, reply.id)"
                  />
                </div>
              </template>
            </Card>
          </div>
        </div>
        <!-- If user wants to reply-->
        <div
          style="width: 70%; background-color: white"
          class="p-d-flex p-py-3 p-px-2 rounded-1 p-mt-4"
          v-if="comment.isReplying"
        >
          <div>
            <img
              style="width: 70%; min-width: 30px"
              :src="getUser.image.png"
              alt=""
            />
          </div>
          <Textarea
            v-model="replyText"
            class="p-mx-auto"
            :autoResize="true"
            rows="3"
            cols="64"
            placeholder="Add a comment..."
          />
          <div class="p-mx-auto">
            <Button
              class="p-px-4 rounded-1 m-blue"
              label="REPLY"
              @click="reply(comment.id)"
            />
          </div>
        </div>
      </div>
      <!-- User Comment-->
      <div
        style="width: 70%; background-color: white"
        class="p-d-flex p-py-3 p-px-2 rounded-1 p-mt-4"
      >
        <div>
          <img
            style="width: 70%; min-width: 30px"
            :src="getUser.image.png"
            alt=""
          />
        </div>
        <Textarea
          v-model="commentText"
          class="p-mx-auto"
          :autoResize="true"
          rows="3"
          cols="64"
          placeholder="Add a comment..."
        />
        <div class="p-mx-auto">
          <Button
            class="p-px-4 rounded-1 m-blue"
            label="SEND"
            @click="addComment()"
          />
        </div>
      </div>
    </div>
    <!-- Mobile design -->
    <div class="container" v-else>
      <div
        style="background: white; width: 90%"
        v-for="(comment, index) in data.comments"
        :key="index"
        class="p-mb-3 p-mx-auto"
      >
        <Card>
          <template #header>
            <div class="p-d-flex">
              <img style="width: 15%" :src="comment.user.image.png" alt="" />
              <h5 class="p-my-0">{{ comment.user.username }}</h5>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import data from "./components/data.json";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "App",
  components: {},
  data() {
    return {
      windowWidth: window.innerWidth,
      replyText: null,
      commentText: null,
      isEditing: false,
      editedText: "",
      comments: data.comments,
      data: data,
    };
  },
  computed: {
    getUser() {
      return data.currentUser;
    },
  },
  methods: {
    addComment() {
      if (this.commentText) {
        data.comments.push({
          id: uuidv4(),
          content: this.commentText,
          score: 0,
          createdAt: Date.now(),
          user: {
            image: {
              png: "https://i.ibb.co/S6TT3JY/image-juliusomo.png",
            },
            username: "juliusomo",
          },
          replies: [],
          isReplying: false,
        });
        this.commentText = null;
        this.$forceUpdate();
      }
    },
    editReply(commentId, replyId, type) {
      // this.isEditing = true;

      data.comments.forEach((comment) => {
        if (comment.id == commentId) {
          if (replyId) {
            comment.replies.forEach((reply) => {
              if (reply.id === replyId) {
                const textArea = document.getElementById(replyId);
                textArea.removeAttribute("disabled");
                textArea.focus();
                reply.isEditing = true;
              }
            });
          } else {
            const textArea = document.getElementById(commentId);
            textArea.removeAttribute("disabled");
            textArea.focus();
            comment.isEditing = true;
          }
        }
      });
      this.$forceUpdate();
    },

    updateReply(commentId, replyId) {
      data.comments.forEach((comment) => {
        if (comment.id == commentId) {
          if (replyId) {
            comment.replies.forEach((reply) => {
              if (reply.id == replyId) {
                const textArea = document.getElementById(replyId);
                // create new property in reply object and store new reply
                reply.editedReply = textArea.value;
                // disable editing
                textArea.setAttribute("disabled", "");
                reply.isEditing = false;
              }
            });
          } else {
            const textArea = document.getElementById(commentId);
            comment.editedComment = textArea.value;
            textArea.setAttribute("disabled", "");
            comment.isEditing = false;
          }
        }
      });
      this.$forceUpdate();
    },
    reply(id) {
      data.comments.forEach((comment) => {
        if (comment.id == id) {
          let reply = {
            replyingTo: comment.user.username,
            id: uuidv4(),
            content: this.replyText,
            createdAt: new Date(),
            score: 0,
            user: {
              image: { png: "https://i.ibb.co/S6TT3JY/image-juliusomo.png" },
              username: "juliusomo",
            },
          };
          comment.replies.push(reply);
          comment.isReplying = false;
          this.replyText = null;
          this.$forceUpdate();
        }
      });
    },
    showReply(id) {
      data.comments.forEach((comment) => {
        if (comment.id == id) {
          comment.isReplying = !comment.isReplying;
        }
      });
      this.$forceUpdate();
    },
    deleteReply(commentId, replyId) {
      if (replyId) {
        data.comments.forEach((comment) => {
          if (comment.id == commentId) {
            comment.replies = comment.replies.filter((reply) => {
              return reply.id != replyId;
            });
          }
        });
      } else {
        data.comments = data.comments.filter((comment) => {
          return comment.id !== commentId;
        });
      }

      this.$forceUpdate();
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>

<style>
.p-card-body {
  padding: 0 !important;
}
.p-card-content {
  padding-bottom: 0 !important;
}
.remove-disabled-effects {
  opacity: 1 !important;
  border: none;
}
.remove-disabled-effects:focus {
  box-shadow: none !important;
  outline: 1px solid hsl(238, 40%, 52%) !important;
}
.bg-white {
  background: white;
}
.bg-brown {
  background-color: brown !important;
  height: 2000px;
}
.bg-dark {
  background: hsl(357, 100%, 86%);
}
.you-tag {
  background: hsl(238, 40%, 52%);
  color: white;
  padding: 0rem 0.3rem;
  padding-bottom: 0.2rem;
}
.bg-lightgrey {
  background: hsl(223, 19%, 93%);
}
.m-blue {
  background: hsl(238, 40%, 52%) !important;
}
.m-blue:hover {
  opacity: 0.4 !important;
}
.color-m-blue {
  color: hsl(238, 40%, 52%) !important;
}
.color-m-blue:hover {
  opacity: 0.4 !important;
  cursor: pointer;
}
.red-and-cursor {
  color: red;
}
.red-and-cursor:hover {
  cursor: pointer;
  opacity: 0.4;
}
.counter-sign {
  font-size: 12px;
  color: hsl(211, 10%, 45%);
}

.p-card-content {
  padding-top: 0 !important;
}
.p-card-body {
  padding-top: 0 !important;
}
.rounded-1 {
  border-radius: 5px;
}
.w-100 {
  width: 100%;
}
.md-blue {
  color: hsl(238, 40%, 52%);
}
.desktop-container {
  width: 75%;
}
.p-card {
  box-shadow: none;
}
/* - Moderate blue: hsl(238, 40%, 52%)
- Soft Red: hsl(358, 79%, 66%)
- Light grayish blue: hsl(239, 57%, 85%)
- Pale red: hsl(357, 100%, 86%)

### Neutral

- Dark blue: hsl(212, 24%, 26%)
- Grayish Blue: hsl(211, 10%, 45%)
- Light gray: hsl(223, 19%, 93%)
- Very light gray: hsl(228, 33%, 97%)
- White: hsl(0, 0%, 100%) */
</style>
