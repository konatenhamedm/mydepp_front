<script lang="ts">
  import {onMount} from 'svelte';
  //import type { User } from '../../types';
  import {getAuthCookie} from '$lib/auth';

  let user: any = [];
  function handleLogout() {
    document.cookie = `auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = '/';
  }

  onMount(async () => {
    user = getAuthCookie();

    console.log(user);
  });
</script>

<header
  class="drop-shadow-1 dark:bg-box-dark sticky top-0 flex min-h-[70px] w-full bg-white max-xl:z-[9999] xl:z-[999] dark:drop-shadow-none"
>
  <!-- Navigation -->
  <div
    class="nav-wrap max-xs:ps-[15px] max-xs:pe-[15px] dark:bg-box-dark flex flex-1 bg-white ps-[30px] pe-[30px] md:ps-[20px]"
  >
    <!-- Header left menu -->

    <ul
      class="nav-left mb-0 flex list-none items-center gap-x-[14px] gap-y-[9px] ps-0"
    >
      <!-- Navigation Items -->
      <li class="xl:hidden xl:[&.flex]:flex" id="topMenu-logo">
        <div
          class="xs:w-[170px] max-xs:w-[100px] max-xs:pe-[15px] dark:border-box-dark-up logo-wrapper dark:bg-box-dark-up flex h-[71px] items-center border-e border-[#edf2f9] max-md:pe-[30px] md:w-[190px]"
        >
          <a href="/admin" class="block text-center">
            <div class="logo-full">
              <img
                class="md:ps-[15px] dark:hidden"
                src="/_files/logo-depps.png"
                alt="Logo"
              />
              <img
                class="hidden md:ps-[15px] dark:block"
                src="/_files/logo-depps.png"
                alt="Logo"
              />
            </div>
          </a>
        </div>
      </li>
      <li>
        <a
          class="hover:bg-primary/10 hover:text-primary dark:hover:text-title-dark dark:hover:bg-box-dark-up group dark:text-subtitle-dark max-md:dark:hover:bg-box-dark-up max-md:bg-normalBG max-md:dark:bg-box-dark-up max-md:dark:hover:text-subtitle-dark flex h-[34px] min-w-[34px] cursor-pointer items-center justify-center rounded-full bg-transparent text-[19px] text-[#525768] transition duration-200 ease-in-out sm:h-[40px] sm:w-[40px] sm:min-w-[40px] sm:text-[20px] xl:[&.hide]:hidden"
          id="slim-toggler"
        >
          <i
            class="uil uil-align-center-alt flex items-center text-current [&.is-folded]:hidden"
          ></i>
        </a>
      </li>
    </ul>

    <!-- Header Center menu -->

    <!-- Header right menu -->

    <div
      class="relative ms-auto flex items-center gap-y-[15px] py-[15px] max-sm:gap-x-[15px] sm:gap-x-[25px]"
    >
      <button
        type="button"
        class="dark:text-subtitle-dark flex min-h-[40px] items-center text-[22px] text-[#a0a0a0] xl:hidden"
        id="author-dropdown"
      >
        <i class="uil uil-ellipsis-v text-[18px]"></i>
      </button>
      <ul
        id="right-ellipsis-trigger"
        class="mb-0 hidden flex-auto list-none items-center justify-end gap-y-[15px] ps-0 max-xl:absolute max-xl:end-0 max-xl:top-[70px] max-xl:z-[1000] max-xl:m-0 max-xl:rounded-lg max-xl:border-none max-xl:bg-white max-xl:bg-clip-padding max-xl:px-[20px] max-xl:py-[10px] max-xl:text-left max-xl:shadow-lg max-sm:gap-x-[15px] max-sm:px-[15px] sm:gap-x-[25px] xl:flex max-xl:dark:bg-neutral-700 max-xl:[&.active]:flex"
      >
        <li>
       <!--    <div class="relative" data-te-dropdown-ref>
            <button
              id="message"
              data-te-dropdown-toggle-ref
              aria-expanded="false"
              type="button"
              class="dark:text-subtitle-dark group relative flex min-h-[40px] items-center text-[22px] text-[#a0a0a0]"
            >
              <i class="uil uil-envelope"></i>
              <span
                class="absolute end-[3px] top-[8px] flex h-1.5 w-1.5 origin-[100%_0%] translate-x-2/4 -translate-y-2/4 group-[[data-te-dropdown-show]]:hidden"
              >
                <span
                  class="bg-success/20 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                ></span>
                <span
                  class="bg-success relative inline-flex h-1.5 w-1.5 rounded-full"
                ></span>
              </span>
            </button>
            <div
              aria-labelledby="message"
              data-te-dropdown-menu-ref
              class="dark:shadow-boxLargeDark absolute z-[1000] m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-clip-padding text-left text-base shadow-lg ltr:float-left rtl:float-right [&[data-te-dropdown-show]]:block"
            >
              <div
                class="dark:bg-box-dark rounded-4 bg-white px-[15px] py-[12px] shadow-[0_2px_8px_rgba(0,0,0,.15)] max-sm:w-[230px] sm:w-[300px] md:min-w-[380px] dark:shadow-[0_5px_30px_rgba(1,4,19,.60)]"
              >
                <h1
                  class="bg-section dark:bg-box-dark-up text-dark dark:text-title-dark flex h-[50px] items-center justify-center rounded-md p-[10px] text-sm font-semibold"
                >
                  <span class="title-text">
                    Messages
                    <span
                      class="bg-success dark:text-title-dark ms-[8px] inline-flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
                    >
                      3
                    </span>
                  </span>
                </h1>
              </div>
            </div>
          </div> -->
        </li>

        <li>
          <div class="relative" data-te-dropdown-ref>
            <button
              type="button"
              id="author-dropdown"
              data-te-dropdown-toggle-ref
              aria-expanded="false"
              class="text-body dark:text-subtitle-dark group me-1.5 flex items-center rounded-full text-sm font-medium whitespace-nowrap capitalize md:me-0"
            >
              <span class="sr-only">Open user menu</span>
              <img
                class="h-8 w-8 min-w-[32px] rounded-full xl:me-2"
                src="/images/avatars/thumbs.png"
                alt="user photo"
              />
              <span class="hidden xl:block"> {user.username}</span>
              <i
                class="uil uil-angle-down text-light dark:text-subtitle-dark hidden text-[18px] xl:block"
              ></i>
            </button>

            <!-- Dropdown menu -->
            <div
              class="dark:shadow-boxLargeDark dark:bg-box-dark-down absolute z-[1000] m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg ltr:float-left rtl:float-right [&[data-te-dropdown-show]]:block"
              aria-labelledby="author-dropdown"
              data-te-dropdown-menu-ref
            >
              <div
                class="dark:bg-box-dark rounded-4 min-w-[310px] bg-white px-[15px] py-[12px] pt-4 shadow-[0_2px_8px_rgba(0,0,0,.15)] max-sm:min-w-full dark:shadow-[0_5px_30px_rgba(1,4,19,.60)]"
              >
                <a
                  class="bg-normalBG dark:bg-box-dark-up text-light hover:text-primary dark:hover:text-subtitle-dark dark:text-title-dark rounded-b-6 mx-[-15px] mb-[-15px] flex h-[50px] items-center justify-center gap-[6px] text-sm font-medium"
                  href="#"
                  on:click={handleLogout}
                >
                  <i class="uil uil-sign-out-alt"></i>Déconnexion</a
                >
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!-- End: Navigation -->
</header>
