<template>
  <div id="app" class="bg-l-grey">
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
            <h4 class="p-my-3 color-m-blue">{{ comment.score }}</h4>
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
                    @click="defineDeleteId(comment.id)"
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
              <h4 class="p-my-3 color-m-blue">{{ reply.score }}</h4>
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
                      @click="defineDeleteId(comment.id, reply.id)"
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
      <Dialog
        class="desktop-dialog"
        :visible.sync="mobileModal"
        position="center"
        modal
      >
        <template #header>
          <h3 class="p-my-0">Delete comment</h3>
        </template>
        <p class="">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </p>
        <template #footer>
          <Button
            label="NO, CANCEL"
            class="rounded-1"
            style="background: hsl(211, 10%, 45%)"
            @click="mobileModal = false"
          />
          <Button
            style="background: hsl(358, 79%, 66%)"
            label="YES, DELETE"
            @click="deleteReply()"
            class="rounded-1 p-mr-5"
          />
        </template>
      </Dialog>
    </div>
    <!-- Mobile design -->
    <div style="height: 2000px" class="container position-relative" v-else>
      <div
        v-for="(comment, index) in data.comments"
        :key="index"
        class="p-mb-3 p-mx-auto p-mt-3"
        style="width: 92%"
      >
        <div
          style="background: white; width: 100%"
          class="p-pl-2 p-pt-3 rounded-1"
        >
          <Card>
            <template #header>
              <div class="p-d-flex">
                <img
                  style="width: 12%"
                  :src="comment.user.image.png"
                  class="p-ml-1"
                />
                <h5 class="p-my-0 p-as-center p-mx-3">
                  {{ comment.user.username }}
                </h5>
                <p class="p-my-0 p-as-center">{{ comment.createdAt }}</p>
              </div>
            </template>
            <template #content>
              <Textarea
                :id="reply.id"
                disabled
                :value="comment.content"
                class="remove-disabled-effects"
                :autoResize="true"
                rows="2"
                style="width: 94%"
              />
              <div class="p-d-flex p-jc-between">
                <div
                  class="p-d-flex p-ml-3 p-as-center bg-lightgrey p-px-2 rounded-1 p-py-1"
                  :class="comment.user.username == 'juliusomo' ? 'p-mb-3' : '0'"
                >
                  <i class="fa-solid fa-plus counter-sign p-mt-2"></i>
                  <h4 class="color-m-blue p-my-0 p-mx-2">
                    {{ comment.score }}
                  </h4>
                  <i class="fa-solid fa-minus counter-sign p-mt-2"></i>
                </div>
                <!-- Delete and edit comment if user is juliusomo -->
                <div
                  v-if="comment.user.username == 'juliusomo'"
                  class="p-ml-auto p-mr-4 p-d-flex p-ai-center p-mb-3"
                >
                  <!-- @click="deleteReply(comment.id)" -->
                  <div
                    class="p-mr-3 red-and-cursor"
                    @click="defineDeleteId(comment.id)"
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

                <!--  -->
                <div v-else @click="showReply(comment.id)">
                  <h4 class="p-ml-auto p-mr-4 color-m-blue">
                    <i class="fa-solid fa-reply"></i>
                    Reply
                  </h4>
                </div>
              </div>
            </template>
          </Card>
        </div>
        <!-- If user wants to reply -->
        <div
          class="p-d-flex p-py-3 p-px-2 rounded-1 p-mt-3"
          v-if="comment.isReplying"
          style="background: white"
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
            class="p-mr-3"
            :autoResize="true"
            rows="3"
            placeholder="Add a comment..."
            style="width: 80%"
          />
          <div class="p-mx-auto">
            <Button
              class="p-px-3 rounded-1 m-blue"
              label="REPLY"
              @click="reply(comment.id)"
            />
          </div>
        </div>
        <!-- v-if="comment.replies.length > 0" -->
        <!-- If replies to comments -->
        <div
          style="background: white; width: 90%"
          class="p-ml-auto p-mt-3 rounded-1 p-pl-2 p-pt-2"
          v-for="(reply, index) in comment.replies"
          :key="index"
        >
          <Card>
            <template #header>
              <div class="p-d-flex">
                <img
                  style="width: 12%"
                  :src="reply.user.image.png"
                  class="p-ml-1"
                />
                <h5 class="p-my-0 p-as-center p-mx-3">
                  {{ reply.user.username }}
                </h5>
                <p class="p-my-0 p-as-center">{{ reply.createdAt }}</p>
              </div>
            </template>
            <template #content>
              <Textarea
                :id="reply.id"
                disabled
                :value="'@' + reply.replyingTo + ' ' + reply.content"
                class="remove-disabled-effects p-my-2"
                :autoResize="true"
                rows="2"
                style="width: 94%"
              />
              <div
                class="p-d-flex p-jc-between"
                :class="reply.user.username == 'juliusomo' ? 'p-pb-3' : '0'"
              >
                <div
                  class="p-d-flex p-ml-3 p-as-center bg-lightgrey p-px-2 rounded-1 p-py-1"
                >
                  <i class="fa-solid fa-plus counter-sign p-mt-2"></i>
                  <h4 class="color-m-blue p-my-0 p-mx-2">
                    {{ reply.score }}
                  </h4>
                  <i class="fa-solid fa-minus counter-sign p-mt-2"></i>
                </div>
                <div
                  v-if="reply.user.username === 'juliusomo'"
                  @click="showReply(reply.id)"
                >
                  <div class="p-d-flex p-mr-3">
                    <div
                      @click="defineDeleteId(comment.id, reply.id)"
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
                </div>

                <div v-else @click="showReply(reply.id)">
                  <h4 class="p-ml-auto p-mr-4 color-m-blue">
                    <i class="fa-solid fa-reply"></i>
                    Reply
                  </h4>
                </div>
              </div>
              <div class="p-d-flex p-jc-end p-pb-2">
                <Button
                  v-if="reply.isEditing"
                  label="UPDATE"
                  class="rounded-1 m-blue p-mr-3"
                  @click="updateReply(comment.id, reply.id)"
                />
              </div>
            </template>
          </Card>
          <Dialog
            class="mobile-dialog"
            :visible.sync="mobileModal"
            position="center"
            modal
          >
            <template #header>
              <h3 class="p-my-0">Delete comment</h3>
            </template>
            <p class="">
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </p>
            <template #footer>
              <Button
                label="NO, CANCEL"
                class="rounded-1"
                style="background: hsl(211, 10%, 45%)"
                @click="mobileModal = false"
              />
              <Button
                style="background: hsl(358, 79%, 66%)"
                label="YES, DELETE"
                @click="deleteReply()"
                class="rounded-1 p-mr-5"
              />
            </template>
          </Dialog>
        </div>
      </div>
      <div
        style="width: 92%; background-color: white"
        class="p-mx-auto p-d-flex p-py-3 p-px-2 rounded-1 p-mt-4"
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
      mobileModal: false,
      deletingReplyId: null,
      deletingCommentId: null,
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
            createdAt: Date.now(),
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
    // get id of comment or both comment and reply for the use of deleteReply method.
    // these methods work together
    defineDeleteId(commentId, replyId) {
      this.mobileModal = true;
      this.deletingCommentId = commentId;
      this.deletingReplyId = replyId;
    },
    deleteReply() {
      console.log(this.deletingCommentId, this.deletingReplyId);
      if (this.deletingReplyId) {
        data.comments.forEach((comment) => {
          if (comment.id == this.deletingCommentId) {
            comment.replies = comment.replies.filter((reply) => {
              return reply.id != this.deletingReplyId;
            });
          }
        });
      } else {
        data.comments = data.comments.filter((comment) => {
          return comment.id !== this.deletingCommentId;
        });
      }
      this.mobileModal = false;

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
.desktop-dialog {
  padding: 0 25%;
  box-shadow: none;
}
.position-relative {
  position: relative;
}
.font-bold {
  font-weight: bold;
}
.mobile-dialog {
  width: 100%;
  margin-bottom: 50%;
  padding: 0 0.7rem;
  box-shadow: none;
}
.p-dialog-header {
  padding: 0 !important;
  padding-top: 1rem !important;
  padding-left: 2rem !important;
  position: center;
}
.p-dialog-content {
  padding: 0 2rem !important;
  padding-right: 3rem !important;
}
.p-dialog-header-close-icon {
  visibility: hidden;
}
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
.bg-l-grey {
  background: hsl(238, 40%, 52%);
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
