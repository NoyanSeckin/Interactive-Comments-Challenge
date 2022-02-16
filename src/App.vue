<template>
  <div class="bg-brown" id="app">
    <div class="p-d-flex p-flex-column p-ai-end container">
      <!-- v for div -->
      <div
        class="w-100 p-mx-auto p-d-flex p-flex-column p-ai-end"
        v-for="(comment, index) in getComments"
        :key="index"
      >
        <div
          style="width: 70%; background: white"
          class="p-d-flex p-px-3 rounded-1 p-mt-3"
        >
          <div
            style="width: 5%"
            class="p-mx-auto p-mb-auto p-mt-3 p-py-2 bg-lightgrey p-text-center rounded-1"
          >
            <i class="fa-solid fa-plus counter-sign"></i>
            <h4 class="p-my-3">12</h4>
            <i class="fa-solid fa-minus counter-sign"></i>
          </div>
          <Card class="" style="width: 90%">
            <template #header>
              <div class="p-d-flex">
                <img
                  class="p-as-center p-ml-3"
                  style="width: 6%; height: 10%"
                  :src="comment.user.image.png"
                  alt=""
                />
                <h4 class="p-mx-3">{{ comment.user.username }}</h4>
                <p class="p-as-center">1 month ago</p>

                <h4 class="p-ml-auto p-mr-4">
                  <i
                    @click="showReply(comment.id)"
                    class="fa-solid fa-reply"
                  ></i>
                  Reply
                </h4>
              </div>
            </template>
            <template #content>
              {{ comment.content }}
            </template>
          </Card>
        </div>
        <!-- If replies -->
        <div
          class="p-d-flex p-flex-column p-ai-end"
          v-if="comment.replies.length > 0"
          style="width: 60%"
        >
          <div
            class="p-d-flex p-jc-end bg-white p-mt-3 rounded-1 p-px-3"
            v-for="(reply, index) in comment.replies"
            :key="index"
            style="min-width: 100%"
          >
            <div
              style="width: 5%"
              class="p-mb-auto p-mx-auto p-mt-3 p-py-2 bg-lightgrey p-text-center rounded-1"
            >
              <i class="fa-solid fa-plus counter-sign"></i>
              <h4 class="p-my-3">12</h4>
              <i class="fa-solid fa-minus counter-sign"></i>
            </div>
            <Card class="p-mt-3 p-ml-3" style="width: 100%">
              <template #header>
                <div class="p-d-flex">
                  <img
                    class="p-as-center p-ml-3"
                    style="width: 6%; height: 10%"
                    :src="reply.user.image.png"
                    alt=""
                  />
                  <h4 class="p-mx-3">{{ reply.user.username }}</h4>
                  <p class="p-as-center">1 month ago</p>
                  <!-- Delete and edit instead of reply if user is juliusomo -->
                  <div
                    v-if="reply.user.username == 'juliusomo'"
                    class="p-ml-auto p-mr-4 p-d-flex p-ai-center"
                  >
                    <div
                      @click="deleteReply(comment.id, reply.id)"
                      class="p-mr-3"
                    >
                      <i class="fa-solid fa-trash p-mr-2"></i>
                      <span>Delete</span>
                    </div>

                    <div @click="editReply(reply.id)">
                      <i class="fa-solid fa-pen p-mr-2"></i>
                      <span>Edit</span>
                    </div>
                  </div>
                  <h4 v-else class="p-ml-auto p-mr-4">
                    <i class="fa-solid fa-reply"></i>
                    Reply
                  </h4>
                </div>
              </template>

              <template #content>
                <Textarea
                  :id="reply.id"
                  disabled
                  :value="'@' + reply.replyingTo + reply.content"
                  class="p-mx-auto remove-disabled-effects"
                  :autoResize="true"
                  rows="3"
                  cols="64"
                />
                <Button
                  v-if="isEditing && reply.user.username == 'juliusomo'"
                  label="UPDATE"
                  @click="updateReply(comment.id, reply.id)"
                />
              </template>
            </Card>
          </div>
        </div>
        <!-- If user wants to reply-->
        <div
          style="width: 70%; background-color: white"
          class="p-d-flex p-py-3 p-px-3 rounded-1 p-mt-4"
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
              class="p-px-4 rounded-1"
              label="REPLY"
              @click="reply(comment.id)"
            />
          </div>
        </div>
      </div>
      <!-- User Comment-->
      <div
        style="width: 70%; background-color: white"
        class="p-d-flex p-py-3 p-px-3 rounded-1 p-mt-4"
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
          <Button class="p-px-4 rounded-1" label="SEND" />
        </div>
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
      replyText: null,
      commentText: null,
      isEditing: true,
      editedText: "",
    };
  },
  computed: {
    getComments() {
      return data.comments;
    },
    getUser() {
      return data.currentUser;
    },
  },
  methods: {
    editedReply() {},
    editReply(id) {
      const textArea = document.getElementById(id);
      textArea.removeAttribute("disabled");
      textArea.focus();
      this.isEditing = true;
    },

    updateReply(commentId, replyId) {
      data.comments.forEach((comment) => {
        if (comment.id == commentId) {
          comment.replies.forEach((reply) => {
            if (reply.id == replyId) {
              const textArea = document.getElementById(replyId);
              textArea.setAttribute("disabled", "");
              this.isEditing = false;
            }
          });
        }
      });
    },
    reply(id) {
      data.comments.forEach((comment) => {
        if (comment.id == id) {
          let replier = {
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
          comment.replies.push(replier);
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
      data.comments.forEach((comment) => {
        console.log(replyId);
        if (comment.id == commentId) {
          comment.replies = comment.replies.filter((reply) => {
            console.log("reply", reply);
            return reply.id != replyId;
          });
          //
          console.log("comment", comment);
          console.log(
            "returned reply array",
            comment.replies.filter((reply) => {
              console.log("reply", reply);
              return reply.id != replyId;
            })
          );
        }
      });
      this.$forceUpdate();
    },
  },
};
</script>

<style>
.remove-disabled-effects {
  opacity: 1 !important;
  border: none;
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
.bg-lightgrey {
  background: hsl(223, 19%, 93%);
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
.container {
  width: 75%;
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
