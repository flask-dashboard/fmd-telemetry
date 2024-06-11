import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'combineReasonsFeedback'
})

export class CombineReasonsFeedbackPipe implements PipeTransform {
  transform(reasons: any[], feedback: any[]): string {
    const reasonsStr = reasons ? reasons.map(r => typeof r === 'string' ? r : JSON.stringify(r)).join(', ') : '';
    const feedbackStr = feedback ? feedback.map(f => JSON.stringify(f)).join(', ') : '';
    return `Reasons: ${reasonsStr}, ${feedbackStr}`;
  }
}
