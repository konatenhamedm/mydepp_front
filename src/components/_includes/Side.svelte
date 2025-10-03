<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import Menu from '../../routes/data/menu.json';
  import MenuSkeleton from '$components/_skeletons/Menu_skeleton.svelte';

  export let user: any;

  let menuItems: any[] = [];
  let isLoading = true;
  let openSubMenus: Set<number> = new Set(); // Utiliser un Set pour gérer plusieurs sous-menus ouverts

  // État pour le lien actuellement cliqué
  let immediatelyActivePath = '';

  // 🔁 Chemin courant réactif via $page
  let currentPath = '';
  $: currentPath = $page?.url?.pathname ?? (browser ? window.location.pathname : '');

  const BASE_LINK_CLASS =
    'rounded-e-[20px] flex h-12 cursor-pointer items-center gap-[16px] truncate px-6 py-4 text-[14px] font-medium outline-none transition-colors duration-300 ease-linear dark:text-subtitle-dark hover:bg-primary/10 dark:hover:bg-box-dark-up';
  const SUB_LINK_CLASS =
    'rounded-e-[20px] flex cursor-pointer items-center truncate py-[10px] pe-6 ps-[60px] text-[14px] outline-none transition-colors duration-300 ease-linear dark:text-subtitle-dark hover:bg-primary/10 dark:hover:bg-box-dark-up';
  const SECTION_TITLE_CLASS =
    'slug dark:text-white/40 mb-[10px] mt-[30px] block px-6 text-[12px] font-medium uppercase text-light';

  function convertIconToUil(icon: string): string {
    if (!icon) return 'uil uil-circle';
    return icon
      .replace(/\bfa\b/g, 'uil')
      .replace(/\bfa-/g, 'uil-')
      .replace(/\bfas\b/g, 'uil')
      .replace(/\bfar\b/g, 'uil');
  }

  const normalize = (p: string) => (p || '').replace(/\/+$/, '');
  
  const isActive = (path: string, exact = false) => {
    if (!path) return false;
    
    if (immediatelyActivePath === path) return true;
    
    const normalizedPath = normalize(path);
    const normalizedCurrent = normalize(currentPath);
    return exact ? normalizedCurrent === normalizedPath : normalizedCurrent.startsWith(normalizedPath);
  };
  
  const hasActiveChild = (subItems: Array<{ path: string }>) =>
    subItems?.some((item) => isActive(item.path)) || false;

  // Ouvrir automatiquement les sous-menus qui contiennent des éléments actifs
  $: if (menuItems.length) {
    menuItems.forEach((item, index) => {
      if (item?.subItems && hasActiveChild(item.subItems)) {
        openSubMenus.add(index);
      }
    });
  }

  const handleImmediateClick = (path: string, event: Event) => {
    event.preventDefault();
    
    immediatelyActivePath = path;
    
    // Réinitialiser les classes active sur tous les liens
    document.querySelectorAll('a').forEach(el => el.classList.remove('active-link'));
    (event.currentTarget as HTMLElement)?.classList.add('active-link');
    
    setTimeout(() => {
      goto(path).catch(() => {
        if (browser) {
          window.location.href = path;
        }
      });
    }, 10);
  };

  $: {
    if (currentPath && immediatelyActivePath) {
      setTimeout(() => {
        immediatelyActivePath = '';
      }, 100);
    }
  }

  const toggleSubMenu = (index: number, event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (openSubMenus.has(index)) {
      openSubMenus.delete(index);
    } else {
      openSubMenus.add(index);
    }
    
    // Forcer la mise à jour en créant un nouveau Set
    openSubMenus = new Set(openSubMenus);
  };

  const isSubMenuOpen = (index: number) => {
    return openSubMenus.has(index);
  };

  onMount(() => {
    try {
      menuItems = Menu && Array.isArray(Menu) && Menu.length ? Menu : getDefaultMenu();
      
      // Initialiser l'ouverture des sous-menus actifs après le chargement
      setTimeout(() => {
        menuItems.forEach((item, index) => {
          if (item?.subItems && hasActiveChild(item.subItems)) {
            openSubMenus.add(index);
          }
        });
        openSubMenus = new Set(openSubMenus);
      }, 50);
    } catch {
      menuItems = getDefaultMenu();
    } finally {
      isLoading = false;
    }
  });

  function getDefaultMenu() {
    return [
      { title: 'Dashboard', icon: 'uil uil-apps', path: '/admin', exact: true },
      { isSectionTitle: true, title: 'Menu par défaut' },
      {
        title: 'Erreur de chargement',
        icon: 'uil uil-exclamation-triangle',
        path: '/admin/error'
      }
    ];
  }
</script>

<aside
  id="asideBar"
  class="asidebar dark:bg-box-dark fixed start-0 top-0 z-[1035] h-screen !w-0 overflow-hidden bg-white !transition-all delay-[0s] !duration-[0.2s] ease-linear xl:!w-[280px]"
>
  <div class="dark:border-box-dark-up logo-wrapper dark:bg-box-dark-up flex h-[71px] w-[280px] items-center border-e border-[#edf2f9] max-xl:hidden">
    <a href="/admin" class="block text-center">
      <div class="logo-full">
        <img class="ps-[27px] dark:hidden" src="/logo-dark.png" alt="Logo" style="height: 20px" />
        <img class="hidden ps-[27px] dark:block" src="/logo-dark.png" alt="Logo" style="height: 20px" />
      </div>
    </a>
  </div>

  <nav id="navBar" class="navBar dark:bg-box-dark scrollbar relative h-[calc(100vh-71px)] bg-white overflow-y-auto">
    {#if isLoading}
      {#each Array(3) as _}
        <MenuSkeleton />
      {/each}
    {:else if menuItems.length > 0}
      <ul class="relative m-0 list-none px-[0.2rem] pb-4">
        {#each menuItems as item, index}
          {#if item.isSectionTitle}
            <li><span class={SECTION_TITLE_CLASS}>{item.title}</span></li>

          {:else if item.subItems}
            <li class="sub-item-wrapper group relative">
              <a
                class={`${BASE_LINK_CLASS} ${hasActiveChild(item.subItems) ? 'active-link2' : ''}`}
                on:click|preventDefault={(e) => toggleSubMenu(index, e)}
              >
                <span class="nav-icon text-[18px]">
                  <i class={convertIconToUil(item.icon) || 'uil uil-circle'}></i>
                </span>
                <span class="title capitalize">{item.title}</span>
                <span class="arrow-down absolute end-0 me-[0.8rem] text-[18px] transition-transform duration-300">
                  <i class="uil uil-angle-down" class:rotate-180={isSubMenuOpen(index) || hasActiveChild(item.subItems)}></i>
                </span>
              </a>

              <ul
                class="sub-item m-0 list-none overflow-hidden p-0 transition-all duration-300 ease-in-out"
                class:open={isSubMenuOpen(index) || hasActiveChild(item.subItems)}
              >
                {#each item.subItems as subItem}
                  <li>
                    <a
                      href={subItem.path}
                      on:click|preventDefault={(e) => handleImmediateClick(subItem.path, e)}
                      class={`${SUB_LINK_CLASS} ${isActive(subItem.path) ? 'active-link' : ''}`}
                    >
                      <i class="uil uil-minus text-[12px] mr-2"></i>
                      {subItem.title}
                    </a>
                  </li>
                {/each}
              </ul>
            </li>

          {:else}
            <li>
              <a
                href={item.path}
                on:click|preventDefault={(e) => handleImmediateClick(item.path, e)}
                class={`${BASE_LINK_CLASS} ${isActive(item.path, !!item.exact) ? 'active-link' : ''}`}
              >
                <span class="nav-icon text-[18px]">
                  <i class={convertIconToUil(item.icon) || 'uil uil-circle'}></i>
                </span>
                <span class="title capitalize">{item.title}</span>
              </a>
            </li>
          {/if}
        {/each}
      </ul>
    {:else}
      <div class="p-6 text-gray-500 dark:text-white/50">⚠️ Aucun menu disponible</div>
    {/if}
  </nav>
</aside>

<style>
  .rotate-180 { 
    transform: rotate(180deg); 
    transition: transform 0.3s ease;
  }

  .sub-item {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
  }

  .sub-item.open {
    max-height: 500px; /* Ajustez cette valeur selon vos besoins */
  }

  .active-link {
    background-color: #4075d7 !important;
    color: #ffffff !important;
    transition: none !important;
  }
.active-link2 {
    background-color: #c2c2d6f5 !important;
    color: #ffffff !important;
    transition: none !important;
  }

  a {
    transition: background-color 300ms ease, color 300ms ease;
  }

  .active-link, .active-link:hover, .active-link:focus {
    background-color: #4075d7 !important;
    color: #ffffff !important;
  }
/*  .active-link2:hover, .active-link2:focus {
    background-color: #4075d7 !important;
    color: #ffffff !important;
  } */

  /* Styles pour le scroll */
  .navBar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 transparent;
  }

  .navBar::-webkit-scrollbar {
    width: 6px;
  }

  .navBar::-webkit-scrollbar-track {
    background: transparent;
  }

  .navBar::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
  }

  .navBar::-webkit-scrollbar-thumb:hover {
    background-color: #a0aec0;
  }

  .dark .navBar::-webkit-scrollbar-thumb {
    background-color: #4a5568;
  }

  .dark .navBar::-webkit-scrollbar-thumb:hover {
    background-color: #718096;
  }
</style>