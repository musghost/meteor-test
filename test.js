if (Meteor.isClient) {
  var toStep = 1;

  var step = function(e, direction) {
    e.preventDefault();

    toStepDirection = toStep;

    if(direction === 'down') {
      toStepDirection = toStep * -1;
    }

    this.value = validValue.call(this, Number(this.value) + toStepDirection);

    this.valueDep.changed();
  };

  var validValue = function(val) {
    if(val > this.max)
      val = this.max

    if(val < this.min)
      val = this.min

    return val;
  };

  Template.input.created = function() {
    this.data.valueDep = new Deps.Dependency();
  };

  Template.input.rendered = function() {
    var _this  = this,
        $input = this.$('input[type="text"]');

    // Set up a Deps on the input's value
    Deps.autorun(function() {

      _this.data.valueDep.depend();

      if($input.is(':focus')) {
        var selectionStart  = $input[0].selectionStart,
            selectionEnd    = $input[0].selectionEnd;

        $input.val(_this.data.value);

        // Reset (i.e. don't move) the cursor position
        $input[0].setSelectionRange(selectionStart, selectionEnd);
      } else {
        $input.val(_this.data.value);
      }
    });

  };

  Template.input.events({
    'keydown input' : function(e) {
      switch ( e.which ) {
        // up arrow
        case 16:
          toStep = 10;
          break;
        case 38:
          step.call(this, e, 'up');
          break;
        // down arrow
        case 40:
          step.call(this, e, 'down');
          break;
      }
    },
    'keyup input' : function(e) {
      switch ( e.which ){
        case 16:
          toStep = 1;
          break;
      }
    }

  });
}
