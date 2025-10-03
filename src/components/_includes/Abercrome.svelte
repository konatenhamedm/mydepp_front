<script lang="ts">
  
export let titre: string = 'Inbox';
export let parent: string = 'Inbox';
export let current: any = [];
</script>

<div class="grid grid-cols-12 gap-5">
    <div class="col-span-12">
        <!-- Breadcrumb Section -->
        <div
            class="ssm:mb-[33px] mb-[18px] flex flex-wrap items-center justify-center gap-x-[15px] gap-y-[5px] leading-[1.8571428571] max-sm:flex-col sm:justify-between"
        >
            <!-- Title -->
            <h4 class="text-dark dark:text-title-dark text-[20px] font-semibold ">{titre}</h4>
            <!-- Breadcrumb Navigation -->
            <div class="flex flex-wrap justify-center">
                <nav>
                    <ol class="mb-0 flex list-none flex-wrap gap-[8px] p-0 max-sm:justify-center">
                        <!-- Parent Link -->
                        <li class="inline-flex items-center">
                            <a
                                class="text-body hover:text-primary group text-[14px] leading-[20px] font-normal dark:text-neutral-200"
                                href="/admin"
                            >
                                <i
                                    class="uil uil-estate text-light me-[8px] text-[16px] group-hover:text-current dark:text-white/50"
                                ></i>{parent}</a
                            >
                        </li>
                        <!-- Middle (Conditional) -->
<!-- 
                        <li
                            class="before:bg-light-extra inline-flex items-center before:me-[7px] before:h-1 before:w-1 before:rounded-[50%] before:pe-0 before:content-[''] before:ltr:float-left rtl:float-right"
                        >
                            <span
                                class="text-body text-[14px] leading-[20px] font-normal capitalize transition duration-300 dark:text-neutral-200"
                                >App</span
                            >
                        </li> -->

                        <!-- Child (Current Page) -->
                        <li
                            class="before:bg-light-extra inline-flex items-center before:me-[7px] before:h-1 before:w-1 before:rounded-[50%] before:pe-0 before:content-[''] before:ltr:float-left rtl:float-right"
                            aria-current="page"
                        >
                            <span
                                class="text-light dark:text-subtitle-dark flex items-center text-[14px] leading-[20px] font-normal capitalize"
                                >{current}</span
                            >
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
</div>