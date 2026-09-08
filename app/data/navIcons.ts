import type { Component } from "vue";
import type { NavIconName } from "~/data/nav";
import IconConsultation from "~/components/icons/IconConsultation.vue";
import IconContact from "~/components/icons/IconContact.vue";
import IconFaq from "~/components/icons/IconFaq.vue";
import IconProducts from "~/components/icons/IconProducts.vue";

export const navIcons: Record<NavIconName, Component> = {
  products: IconProducts,
  consultation: IconConsultation,
  faq: IconFaq,
  contact: IconContact,
};
