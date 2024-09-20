<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
// @import "tailwindcss/base";
// @import "tailwindcss/components";
// @import "tailwindcss/utilities";
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
