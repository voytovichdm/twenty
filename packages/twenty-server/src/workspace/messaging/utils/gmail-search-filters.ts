export const gmailSearchFilterNonPersonalEmails =
  'noreply OR no-reply OR do_not_reply OR no.reply OR accounts@ OR info@ OR admin@ OR contact@ OR hello@ OR support@ OR sales@ OR feedback@ OR service@ OR help@ OR mailer-daemon OR notifications OR digest OR auto OR apps OR assign OR comments OR customer-success OR enterprise OR esign OR express OR forum OR gc@ OR learn OR mailer OR marketing OR messages OR news OR notification OR payments OR receipts OR recrutement OR security OR service OR support OR team';

export const gmailSearchFilterExcludeEmailAdresses = (
  emails?: string[],
): string => {
  if (!emails || emails.length === 0) {
    return `from:-(${gmailSearchFilterNonPersonalEmails}`;
  }

  return `(in:inbox from:-(${gmailSearchFilterNonPersonalEmails} OR ${emails.join(
    ' OR ',
  )}) OR (in:sent to:-(${gmailSearchFilterNonPersonalEmails} OR ${emails.join(
    ' OR ',
  )}))`;
};

export const gmailSearchFilterIncludeOnlyEmailAdresses = (
  emails?: string[],
): string => {
  if (!emails || emails.length === 0) {
    return '';
  }

  return `(in:inbox from:(${emails.join(' OR ')}) OR (in:sent to:(${emails.join(
    ' OR ',
  )}))`;
};

export const gmailSearchFilterEmailAdresses = (
  includedEmails?: string[],
  excludedEmails?: string[],
): string => {
  if (
    (!includedEmails || includedEmails.length === 0) &&
    (!excludedEmails || excludedEmails.length === 0)
  ) {
    return '';
  }

  if (!includedEmails || includedEmails.length === 0) {
    return gmailSearchFilterExcludeEmailAdresses(excludedEmails);
  }

  if (!excludedEmails || excludedEmails.length === 0) {
    return gmailSearchFilterIncludeOnlyEmailAdresses(includedEmails);
  }

  return `(in:inbox from:((${includedEmails.join(
    ' OR ',
  )}) -(${gmailSearchFilterNonPersonalEmails} ${excludedEmails.join(
    ' OR ',
  )})) OR (in:sent to:((${includedEmails.join(
    ' OR ',
  )}) -(${gmailSearchFilterNonPersonalEmails} OR ${excludedEmails.join(
    ' OR ',
  )}))`;
};
