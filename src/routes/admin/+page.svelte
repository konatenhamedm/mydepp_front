<script lang="ts">
  import Abercrome from '$components/_includes/Abercrome.svelte';
  import {getAuthCookie} from '$lib/auth';
  import {onMount} from 'svelte';
  let userData: any = [];

  onMount(async () => {
    userData = getAuthCookie();
  });
</script>

<div
  class=" ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]"
>
  <Abercrome titre="devise" parent="Dashbord" current="devise" />

  <!-- filtres -->
  <div
    class="mb-6 p-4 bg-white rounded-lg shadow flex flex-wrap gap-4 items-end"
  >
    <h1>{JSON.stringify(userData)}</h1>
  </div>
</div>
