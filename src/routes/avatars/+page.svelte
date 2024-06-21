<script lang="ts">
  import { goto } from "$app/navigation";
  import { avatarPath } from "../../store";

  const avatars = [
    "/img/avatar/avatar1.png",
    "/img/avatar/avatar2.png",
    "/img/avatar/avatar3.png",
    "/img/avatar/avatar4.png",
    "/img/avatar/avatar5.png",
    "/img/avatar/avatar6.png",
    "/img/avatar/avatar7.png",
    "/img/avatar/avatar8.png",
    "/img/avatar/avatar9.png",
    "/img/avatar/avatar10.png",
    "/img/avatar/avatar11.png",
    "/img/avatar/avatar12.png",
    "/img/avatar/avatar13.png",
    "/img/avatar/avatar14.png",
    "/img/avatar/avatar15.png",
  ];

  const handleAvatarSelection = (avatar: string) => {
    avatarPath.set(avatar);
    goto("/questions");
  };
</script>

<div class="p-6 max-w-5xl mx-auto bg-base-200 rounded-xl shadow-md space-y-4">
  <h1 class="text-2xl font-bold">Choose an Avatar</h1>
  <div class="grid grid-cols-5 gap-8">
    {#each avatars as avatar}
      <div
        class="card flex w-44 h-44 bg-base-100 shadow-md cursor-pointer items-center justify-center"
        on:click={() => handleAvatarSelection(avatar)}
      >
        <figure class="w-36 h-36 mx-auto justify-center">
          <img src={avatar} alt="Avatar" class="rounded-xl w-full" />
        </figure>
      </div>
    {/each}
  </div>
</div>
