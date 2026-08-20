import type { VendorOfficialSourceRegistryEntry } from "@/domain/schemas/asset-discovery";

function videoVendor(
  productSlug: string,
  productName: string,
  organizationName: string,
  officialDomains: string[],
  channels: Array<{ channelName: string; channelUrl: string }>,
): VendorOfficialSourceRegistryEntry {
  return {
    productSlug,
    productName,
    organizationName,
    officialDomains,
    officialVideoChannels: channels.map((c) => ({
      provider: "youtube",
      channelName: c.channelName,
      channelUrl: c.channelUrl,
      verified: true,
    })),
  };
}

/** Official YouTube channels oEmbed-verified during coverage-gap import. */
export const COVERAGE_GAP_VENDOR_REGISTRY: VendorOfficialSourceRegistryEntry[] = [
  videoVendor("ashby", "Ashby", "Ashby, Inc.", ["ashbyhq.com", "www.ashbyhq.com"], [
    { channelName: "Ashby", channelUrl: "https://www.youtube.com/@AshbyHQ" },
  ]),
  videoVendor("beehiiv", "Beehiiv", "beehiiv", ["beehiiv.com", "www.beehiiv.com"], [
    { channelName: "beehiiv", channelUrl: "https://www.youtube.com/@beehiiv" },
  ]),
  videoVendor("constant-contact", "Constant Contact", "Constant Contact", ["constantcontact.com", "www.constantcontact.com"], [
    { channelName: "Constant Contact", channelUrl: "https://www.youtube.com/@ConstantContact" },
  ]),
  videoVendor("dayforce", "Dayforce", "Dayforce, Inc.", ["dayforce.com", "www.dayforce.com"], [
    { channelName: "Dayforce", channelUrl: "https://www.youtube.com/@Dayforce" },
  ]),
  videoVendor("flodesk", "Flodesk", "Flodesk", ["flodesk.com", "www.flodesk.com"], [
    { channelName: "Flodesk", channelUrl: "https://www.youtube.com/@Flodesk" },
  ]),
  videoVendor("hibob", "HiBob", "HiBob", ["hibob.com", "www.hibob.com"], [
    { channelName: "HiBob, modern HR made for modern business", channelUrl: "https://www.youtube.com/@HiBobHR" },
  ]),
  videoVendor("instantly", "Instantly", "Instantly", ["instantly.ai"], [
    { channelName: "Instantly", channelUrl: "https://www.youtube.com/@InstantlyAI" },
  ]),
  videoVendor("iterable", "Iterable", "Iterable", ["iterable.com"], [
    { channelName: "Iterable", channelUrl: "https://www.youtube.com/@Iterable" },
  ]),
  videoVendor("kit", "Kit", "Kit", ["kit.com"], [
    { channelName: "Kit", channelUrl: "https://www.youtube.com/@Kit" },
  ]),
  videoVendor("lemlist", "Lemlist", "lemlist", ["lemlist.com", "www.lemlist.com"], [
    { channelName: "lemlist", channelUrl: "https://www.youtube.com/@lemlist" },
  ]),
  videoVendor("mailjet", "Mailjet", "Sinch Mailjet", ["mailjet.com", "www.mailjet.com"], [
    { channelName: "Sinch Mailjet", channelUrl: "https://www.youtube.com/@Mailjet" },
  ]),
  videoVendor("manychat", "ManyChat", "ManyChat, Inc.", ["manychat.com"], [
    { channelName: "Manychat", channelUrl: "https://www.youtube.com/@ManyChat" },
  ]),
  videoVendor("omnisend", "Omnisend", "Omnisend", ["omnisend.com", "www.omnisend.com"], [
    { channelName: "Omnisend", channelUrl: "https://www.youtube.com/@Omnisend" },
  ]),
  videoVendor("paycor", "Paycor", "Paycor, Inc.", ["paycor.com", "www.paycor.com"], [
    { channelName: "Paycor", channelUrl: "https://www.youtube.com/@PaycorInc" },
  ]),
  videoVendor("paylocity", "Paylocity", "Paylocity Corporation", ["paylocity.com", "www.paylocity.com"], [
    { channelName: "Paylocity", channelUrl: "https://www.youtube.com/@Paylocity" },
  ]),
  videoVendor("salesloft", "Salesloft", "Salesloft", ["salesloft.com"], [
    { channelName: "Salesloft", channelUrl: "https://www.youtube.com/@Salesloft" },
  ]),
  videoVendor("sprout-social", "Sprout Social", "Sprout Social", ["sproutsocial.com"], [
    { channelName: "Sprout Social", channelUrl: "https://www.youtube.com/@SproutSocial" },
  ]),
  videoVendor("ukg-pro", "UKG Pro", "UKG Inc.", ["ukg.com", "www.ukg.com"], [
    { channelName: "UKG", channelUrl: "https://www.youtube.com/@UKGinc" },
  ]),
  videoVendor("otter-ai", "Otter.ai", "Otter.ai, Inc.", ["otter.ai"], [
    { channelName: "Otter_ai", channelUrl: "https://www.youtube.com/@otterai" },
  ]),
  videoVendor("agorapulse", "Agorapulse", "Agorapulse", ["agorapulse.com", "www.agorapulse.com"], [
    { channelName: "Agorapulse", channelUrl: "https://www.youtube.com/@agorapulseofficial" },
  ]),
  videoVendor("braze", "Braze", "Braze", ["braze.com", "www.braze.com"], [
    { channelName: "Braze", channelUrl: "https://www.youtube.com/@Braze" },
  ]),
  videoVendor("later", "Later", "Later", ["later.com"], [
    { channelName: "Later", channelUrl: "https://www.youtube.com/@LaterMedia" },
  ]),
  videoVendor("lever", "Lever", "Employ, Inc.", ["lever.co", "www.lever.co"], [
    { channelName: "Employ", channelUrl: "https://www.youtube.com/user/LeverApp" },
  ]),
  videoVendor("adp-workforce-now", "ADP Workforce Now", "ADP, Inc.", ["adp.com", "www.adp.com"], [
    { channelName: "ADP", channelUrl: "https://www.youtube.com/user/adp" },
  ]),
  videoVendor("customer-io", "Customer.io", "Customer.io", ["customer.io"], [
    { channelName: "Customerio", channelUrl: "https://www.youtube.com/@customerio" },
  ]),
  videoVendor("zoho-desk", "Zoho Desk", "Zoho Corporation Pvt. Ltd.", ["zoho.com", "www.zoho.com"], [
    { channelName: "Zoho Desk", channelUrl: "https://www.youtube.com/@ZohoDesk" },
  ]),
  videoVendor("oracle-hcm", "Oracle Cloud HCM", "Oracle Corporation", ["oracle.com", "www.oracle.com"], [
    { channelName: "Oracle Cloud HCM", channelUrl: "https://www.youtube.com/@OracleCloudHCM" },
  ]),
  videoVendor("adobe-firefly", "Adobe Firefly", "Adobe Inc.", ["adobe.com", "www.adobe.com"], [
    { channelName: "Adobe Firefly", channelUrl: "https://www.youtube.com/@AdobeFirefly" },
  ]),
  videoVendor("switcher-studio", "Switcher Studio", "Switcher Studio", ["switcherstudio.com", "www.switcherstudio.com"], [
    { channelName: "Switcher", channelUrl: "https://www.youtube.com/@SwitcherStudio" },
  ]),
  videoVendor("clickfunnels", "ClickFunnels", "ClickFunnels", ["clickfunnels.com", "www.clickfunnels.com"], [
    { channelName: "ClickFunnels", channelUrl: "https://www.youtube.com/@ClickFunnels" },
  ]),
  videoVendor("workable", "Workable", "Workable Software Ltd", ["workable.com", "www.workable.com"], [
    { channelName: "Workable", channelUrl: "https://www.youtube.com/c/WorkableSoftware" },
  ]),
  videoVendor("deputy", "Deputy", "Deputy Corporation", ["deputy.com", "www.deputy.com"], [
    { channelName: "Deputy", channelUrl: "https://www.youtube.com/channel/UCmMMWmCiGx7R3LRN9eXyF8Q" },
  ]),
  videoVendor("bright-data", "Bright Data", "Bright Data Ltd.", ["brightdata.com"], [
    { channelName: "Bright Data", channelUrl: "https://www.youtube.com/@BrightData" },
  ]),
  videoVendor("motion", "Motion", "Motion", ["usemotion.com", "www.usemotion.com"], [
    { channelName: "Motion", channelUrl: "https://www.youtube.com/@usemotion" },
  ]),
  videoVendor("twilio", "Twilio", "Twilio Inc.", ["twilio.com", "www.twilio.com"], [
    { channelName: "TwilioDevs", channelUrl: "https://www.youtube.com/@TwilioDevs" },
    { channelName: "Twilio", channelUrl: "https://www.youtube.com/@Twilio" },
  ]),
  videoVendor("gorgias", "Gorgias", "Gorgias", ["gorgias.com", "www.gorgias.com"], [
    { channelName: "Gorgias", channelUrl: "https://www.youtube.com/@gorgias-ecommerce" },
  ]),
  videoVendor("homebase", "Homebase", "Homebase", ["joinhomebase.com", "www.joinhomebase.com"], [
    { channelName: "Homebase", channelUrl: "https://www.youtube.com/@HomebaseApp" },
  ]),
  videoVendor("when-i-work", "When I Work", "When I Work", ["wheniwork.com", "www.wheniwork.com"], [
    { channelName: "When I Work", channelUrl: "https://www.youtube.com/@WhenIWork" },
  ]),
  videoVendor("meltwater", "Meltwater", "Meltwater", ["meltwater.com", "www.meltwater.com"], [
    { channelName: "Meltwater", channelUrl: "https://www.youtube.com/user/MeltwaterGroup" },
  ]),
  videoVendor("livechat", "LiveChat", "LiveChat", ["livechat.com", "www.livechat.com"], [
    { channelName: "LiveChat", channelUrl: "https://www.youtube.com/@LiveChat" },
  ]),
  videoVendor("smartlead", "Smartlead", "Smartlead", ["smartlead.ai"], [
    { channelName: "Smartlead", channelUrl: "https://www.youtube.com/@SmartleadAI" },
  ]),
  videoVendor("gamma", "Gamma", "Gamma", ["gamma.app"], [
    { channelName: "Gamma", channelUrl: "https://www.youtube.com/@meetgamma" },
  ]),
  videoVendor("outreach", "Outreach", "Outreach", ["outreach.io", "www.outreach.io"], [
    { channelName: "Outreach", channelUrl: "https://www.youtube.com/@Outreach" },
  ]),
  videoVendor("moosend", "Moosend", "Moosend", ["moosend.com", "www.moosend.com"], [
    { channelName: "Moosend | Email Marketing Software", channelUrl: "https://www.youtube.com/@Moosend" },
  ]),
  videoVendor("drip", "Drip", "Drip", ["drip.com", "www.drip.com"], [
    { channelName: "Drip", channelUrl: "https://www.youtube.com/channel/UCorLY3m-KyLXc8k78VhdvoA" },
  ]),
  videoVendor("bitbucket", "Bitbucket", "Atlassian", ["bitbucket.org", "atlassian.com", "www.atlassian.com"], [
    { channelName: "Atlassian", channelUrl: "https://www.youtube.com/@Atlassian" },
  ]),
  videoVendor("leadpages", "Leadpages", "Leadpages", ["leadpages.com", "www.leadpages.com"], [
    { channelName: "Leadpages", channelUrl: "https://www.youtube.com/@Leadpages" },
  ]),
  videoVendor("fireflies", "Fireflies.ai", "Fireflies.ai", ["fireflies.ai"], [
    { channelName: "Fireflies AI", channelUrl: "https://www.youtube.com/@FirefliesAI" },
  ]),
  videoVendor("synthesia", "Synthesia", "Synthesia", ["synthesia.io", "www.synthesia.io"], [
    { channelName: "Synthesia", channelUrl: "https://www.youtube.com/@Synthesia" },
  ]),
  videoVendor("wix", "Wix", "Wix", ["wix.com", "www.wix.com"], [
    { channelName: "Wix", channelUrl: "https://www.youtube.com/@Wix" },
  ]),
  videoVendor("squarespace", "Squarespace", "Squarespace", ["squarespace.com", "www.squarespace.com"], [
    { channelName: "Squarespace Help", channelUrl: "https://www.youtube.com/@SquarespaceHelp" },
    { channelName: "Squarespace", channelUrl: "https://www.youtube.com/@Squarespace" },
  ]),
  videoVendor("magento", "Adobe Commerce", "Adobe", ["adobe.com", "magento.com", "business.adobe.com"], [
    { channelName: "Adobe for Business", channelUrl: "https://www.youtube.com/@AdobeforBusiness" },
  ]),
  videoVendor("appdynamics", "AppDynamics", "Cisco Systems, Inc. / AppDynamics", ["appdynamics.com", "www.appdynamics.com"], [
    { channelName: "Cisco AppDynamics", channelUrl: "https://www.youtube.com/@appdynamics" },
  ]),
  videoVendor("ecwid", "Ecwid", "Lightspeed", ["ecwid.com", "www.ecwid.com"], [
    { channelName: "Ecwid by Lightspeed", channelUrl: "https://www.youtube.com/user/EcwidTeam" },
  ]),
  videoVendor("haloitsm", "HaloITSM", "Halo Service Solutions Ltd.", ["haloitsm.com", "www.haloitsm.com", "usehalo.com", "www.usehalo.com"], [
    { channelName: "Halo", channelUrl: "https://www.youtube.com/@usehalo" },
  ]),
  videoVendor("lightspeed-retail", "Lightspeed Retail", "Lightspeed", ["lightspeedhq.com", "www.lightspeedhq.com"], [
    { channelName: "Lightspeed HQ", channelUrl: "https://www.youtube.com/@lightspeedhq" },
  ]),
  videoVendor("manageengine-servicedesk-plus", "ManageEngine ServiceDesk Plus", "Zoho Corporation / ManageEngine", ["manageengine.com", "www.manageengine.com"], [
    { channelName: "ManageEngine", channelUrl: "https://www.youtube.com/@manageengine" },
  ]),
  videoVendor("prestashop", "PrestaShop", "PrestaShop / Fortidia", ["prestashop.com", "www.prestashop.com"], [
    { channelName: "PrestaShop Official", channelUrl: "https://www.youtube.com/prestashop" },
  ]),
  videoVendor("printify", "Printify", "Printify", ["printify.com", "www.printify.com"], [
    { channelName: "Printify", channelUrl: "https://www.youtube.com/@Printify" },
  ]),
  videoVendor("salesforce-commerce-cloud", "Salesforce Commerce Cloud", "Salesforce", ["salesforce.com", "www.salesforce.com"], [
    { channelName: "Salesforce", channelUrl: "https://www.youtube.com/@salesforce" },
    { channelName: "Salesforce Product Center", channelUrl: "https://www.youtube.com/@SalesforceProductCenter" },
  ]),
  videoVendor("webflow", "Webflow", "Webflow", ["webflow.com", "www.webflow.com"], [
    { channelName: "Webflow", channelUrl: "https://www.youtube.com/@Webflow" },
  ]),
  videoVendor("zyte", "Zyte", "Zyte Group Ltd.", ["zyte.com", "www.zyte.com"], [
    { channelName: "Zyte", channelUrl: "https://www.youtube.com/@zytedata" },
  ]),
];
