// Dependencies

/**
 * Wrapper for document from article:
 * https://www.washingtonpost.com/technology/2023/01/17/jan6-committee-report-social-media/
 *
 * @param {*} source - Source object with url key
 */
export default async function wapoSocialMediaLeak(source) {
  const materials = [
    {
      id: `${source.id}--social-media-report`,
      title:
        "Social Media & the January 6th Attack on the U.S. Capitol: Summary of Investigative Findings",
      description:
        "122-page memo summarizing investigative findings on social media and the Jan. 6 attack.",
      url: "https://www.washingtonpost.com/documents/5bfed332-d350-47c0-8562-0137a4435c68.pdf",

      details_url:
        "https://www.washingtonpost.com/technology/2023/01/17/jan6-committee-report-social-media/",
    },
  ];

  return materials;
}
