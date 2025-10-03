<script lang="ts">
    export let title:any;
    export let total:any;
    export let icon:any;
</script>

<div class="col-span-12 sm:col-span-6 2xl:col-span-3">
    <div
        class="dark:bg-box-dark rounded-10 text-body dak:text-subtitle-dark relative overflow-hidden bg-white px-[25px] py-[25px] pb-[12px] text-[15px]"
    >
        <div class="flex justify-between">
            <div>
                <span class="text-body dark:text-subtitle-dark text-15 font-normal"
                    >{title}</span
                >
                <h4
                    class="text-dark dark:text-title-dark mb-0 text-3xl leading-normal font-semibold max-lg:text-[26px] max-sm:text-2xl"
                >
                    <div class="countCategories flex items-center" data-number={total}>
                        <span class="countNumber">{total}</span>

                       <!--  <span>+</span> -->
                    </div>
                </h4>
                <div>
                   <!--  <span class="inline-flex h-11 w-full items-center gap-[10px] rounded-lg">
                        <span class="text-success flex items-center gap-[2px] text-sm font-medium">
                            <i class="uil uil-arrow-up text-[18px]"></i> 25.36%
                        </span>
                        <span class="text-light dark:text-subtitle-dark text-sm">Since last month</span>
                    </span> -->
                </div>
            </div>
            <div
                class="bg-primary/10 max-ssm:w-[230px] text-primary absolute top-0 flex h-full w-[230px] items-center justify-start overflow-hidden rounded-full px-[30px] max-md:w-[210px] ltr:-right-[140px] rtl:-left-[140px]"
            >
                <div class="text-primary flex items-center justify-center">
                    <div class="text-primary flex items-center text-[36px]">
                        <i class={icon}></i>
                        <!-- <i class="uil uil-arrow-growth"></i> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>